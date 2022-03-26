import { comma, formatter, getMaxLength, help } from "./lib/utils.ts";
import { runner } from "./lib/common.ts";

const [rawColumn, filename] = Deno.args;
const column = Number(rawColumn);

if (Number.isNaN(column)) {
  help();
}

const command = (() => {
  const bash = [];
  if (filename.endsWith(".csv")) {
    bash.push(`cut -f${column} -d,`);
  } else if (filename.endsWith(".tsv")) {
    bash.push(`cut -f${column}`);
  } else if (filename.endsWith(".txt")) {
    if (column !== 1) {
      help();
    }
    bash.push("cat");
  } else {
    help();
  }
  bash.push(`${filename} | sort -n | awk`);
  bash.push(
    `'NR==1{min=$1}{sum+=$1;d[NR]=$1}END{avg=sum/NR;for(i in d)s+=(d[i]-avg)^2;print sqrt(s/(NR-1)),avg,sum,NR,d[NR],min,sqrt(s/(NR-1))/sqrt(NR),s/(NR-1),(NR%2)?d[(NR+1)/2]:(d[NR/2]+d[NR/2+1])/2}'`,
  );
  return bash.join(" ");
})();

const [stddev, mean, sum, count, max, min, stderr, variance, median] =
  await runner
    .run(command).then((s) => s.trim().split(" "));

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

const { println } = formatter(14, getMaxLength(stats));
Object.entries(stats).forEach(([key, value]) => {
  println(key, value);
});

Deno.exit(0);
