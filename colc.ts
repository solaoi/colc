import {
  comma,
  formatter,
  getMaxLength,
  help,
  showHeader,
} from "./lib/utils.ts";
import { runner } from "./lib/common.ts";

const [rawColumn, filename] = Deno.args;
const column = Number(rawColumn);

if (Number.isNaN(column)) {
  help();
}
const isCsv = filename.endsWith(".csv");
const headerName = await runner.run(
  `head -n 1 ${filename}| cut -f${column} ${isCsv && "-d, "}| tr -d 0-9.-`,
);
const hasHeader = headerName !== "";

const statsCommand = (() => {
  const bash = [];
  if (hasHeader) {
    bash.push(`tail -n +2 ${filename} | cut -f${column} ${isCsv && "-d, "}`);
  } else {
    bash.push(
      `cut -f${column} ${isCsv && "-d, "}${filename} `,
    );
  }
  bash.push("| sort -n | awk");
  bash.push(
    `'NR==1{min=$1}{sum+=$1;d[NR]=$1}END{avg=sum/NR;for(i in d)s+=(d[i]-avg)^2;print sqrt(s/(NR-1)),avg,sum,NR,d[NR],min,sqrt(s/(NR-1))/sqrt(NR),s/(NR-1),(NR%2)?d[(NR+1)/2]:(d[NR/2]+d[NR/2+1])/2}'`,
  );
  return bash.join(" ");
})();

const [stddev, mean, sum, count, max, min, stderr, variance, median] =
  await runner
    .run(statsCommand).then((s) => s.split(" "));

const stats = {
  "count": comma(count),
  "sum": comma(sum),
  "min": comma(min),
  "max": comma(max),
  "mean": comma(mean),
  "median": comma(median),
  "stddev(σ)": comma(stddev),
  "stderr": comma(stderr),
  "variance(σ^2)": comma(variance),
  "mean±σ(≒68%)": `${comma(String(Number(mean) - Number(stddev)))}, ${
    comma(String(Number(mean) + Number(stddev)))
  }`,
  "mean±2σ(≒95%)": `${comma(String(Number(mean) - 2 * Number(stddev)))}, ${
    comma(String(Number(mean) + 2 * Number(stddev)))
  }`,
  "mean±3σ(≒99%)": `${comma(String(Number(mean) - 3 * Number(stddev)))}, ${
    comma(String(Number(mean) + 3 * Number(stddev)))
  }`,
};
hasHeader && showHeader(headerName, getMaxLength(stats));
const { println } = formatter(14, getMaxLength(stats));
Object.entries(stats).forEach(([key, value]) => {
  println(key, value);
});

Deno.exit(0);
