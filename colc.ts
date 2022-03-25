import { comma, help } from "./utils.ts";
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";

const [rawColumn, filename] = Deno.args;
const column = Number(rawColumn);

if (Number.isNaN(column)) {
  help();
}

const cmd = ["awk"];

if (filename.endsWith(".csv")) {
  cmd.push("-F");
  cmd.push(",");
} else if (filename.endsWith(".tsv")) {
  cmd.push("-F");
  cmd.push("\t");
} else if (filename.endsWith(".txt")) {
  if (column !== 1) {
    help();
  }
} else {
  help();
}

cmd.push(
  `NR==1{min=$${column};max=$${column}}{min=(min<=$${column})?min:$${column};max=(max>=$${column})?max:$${column};sum+=$${column};d[NR]=$${column}}END{avg=sum/NR;for(i in d)s+=(d[i]-avg)^2;print sqrt(s/(NR-1)),avg,sum,NR,max,min,sqrt(s/(NR-1))/sqrt(NR),s/(NR-1)}`,
);
cmd.push(filename);

const p = Deno.run({
  cmd,
  stdout: "piped",
  stderr: "piped",
});

const { code } = await p.status();
if (code === 0) {
  const [stddev, mean, sum, count, max, min, stderr, variance] = await p
    .output().then(
      (s) => new TextDecoder().decode(s),
    ).then((s) => s.trim().split(" "));
  const getMaxLength = (arr: string[]) => {
    return arr.reduce((a, c) => c.length > a.length ? c : a, "").length;
  };
  const stats = [
    comma(count),
    comma(min),
    comma(max),
    comma(mean),
    comma(sum),
    comma(stddev),
    comma(stderr),
    comma(variance),
    `${comma(String(Number(mean) - Number(stddev)))}, ${
      comma(String(Number(mean) + Number(stddev)))
    }`,
    `${comma(String(Number(mean) - 2 * Number(stddev)))}, ${
      comma(String(Number(mean) + 2 * Number(stddev)))
    }`,
    `${comma(String(Number(mean) - 3 * Number(stddev)))}, ${
      comma(String(Number(mean) + 3 * Number(stddev)))
    }`,
  ];
  const maxLength = getMaxLength(stats);
  const [
    formatCount,
    formatMin,
    formatMax,
    formatMean,
    formatSum,
    formatStddev,
    formatStderr,
    formatVariance,
    formatMean1sigma,
    formatMean2sigma,
    formatMean3sigma,
  ] = stats;

  const format = (keySpace: number, valueSpace: number, inverse = false) => {
    return (key: string, value: string) => {
      inverse = !inverse;
      const keySpaces = " ".repeat(keySpace - key.length);
      const valueSpaces = " ".repeat(valueSpace - value.length);
      if (inverse) {
        console.log(
          chalk.inverse(
            chalk.bold(key) + keySpaces + "| " + chalk.italic(value) +
              valueSpaces,
          ),
        );
      } else {
        console.log(
          chalk.bold(key) + keySpaces + "| " + chalk.italic(value) +
            valueSpaces,
        );
      }
    };
  };

  const $ = format(14, maxLength);
  $("count", formatCount);
  $("min", formatMin);
  $("max", formatMax);
  $("mean", formatMean);
  $("sum", formatSum);
  $("stddev(σ)", formatStddev);
  $("stderr", formatStderr);
  $("variance(σ^2)", formatVariance);
  $("mean±σ(≒68%)", formatMean1sigma);
  $("mean±2σ(≒95%)", formatMean2sigma);
  $("mean±3σ(≒99%)", formatMean3sigma);
} else {
  const rawError = await p.stderrOutput();
  const errorString = new TextDecoder().decode(rawError);
  console.log(errorString);
}

Deno.exit(0);
