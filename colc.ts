import {
  comma,
  formatter,
  getMaxLength,
  getMaxNumLength,
} from "./lib/utils.ts";
import { runner } from "./lib/common.ts";
import { parse } from "https://deno.land/std@0.66.0/flags/mod.ts";

const { _, binsize, b, filter, f } = parse(Deno.args);
const [column, filename] = _;
if (typeof column !== "number" || typeof filename !== "string") {
  console.log("Usage:\n  colc [column] [file.csv|tsv|txt]");
  Deno.exit(1);
}
const binSize: number | null = (() => {
  if (typeof binsize === "number" && binsize > 0) return binsize;
  if (typeof b === "number" && b > 0) return b;
  return null;
})();
const filterRank: number = (() => {
  if (typeof filter === "number" && filter > 0) return filter;
  if (typeof f === "number" && f > 0) return f;
  return 0;
})();

const isCsv = filename.endsWith(".csv");
const headerName = await runner.run(
  `head -n 1 ${filename}| cut -f${column} ${isCsv ? "-d, " : ""}| tr -d 0-9.-`,
);
const hasHeader = headerName !== "";

if (binSize === null) {
  const statsCommand = (() => {
    const bash = [];
    if (hasHeader) {
      bash.push(
        `tail -n +2 ${filename} | cut -f${column} ${isCsv ? "-d, " : ""}`,
      );
    } else {
      bash.push(
        `cut -f${column} ${isCsv ? "-d, " : ""}${filename} `,
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
  const { println, showHeader, hr } = formatter(14, getMaxLength(stats));
  hasHeader && showHeader(headerName);
  Object.entries(stats).forEach(([key, value]) => {
    println(key, value);
  });
  hr();
  Deno.exit(0);
}

const freqCommand = (() => {
  const bash = [];
  if (hasHeader) {
    bash.push(
      `tail -n +2 ${filename} | cut -f${column} ${isCsv ? "-d, " : ""}`,
    );
  } else {
    bash.push(
      `cut -f${column} ${isCsv ? "-d, " : ""}${filename} `,
    );
  }
  bash.push("| awk");
  bash.push(
    `'{b=int($1/${binSize});a[b]++;bmax=b>bmax?b:bmax; bmin=b<bmin?b:bmin}END{freq="";for(i in a)freq=freq "|" i "_" a[i];print NR, freq, bmin, bmax}'`,
  );
  return bash.join(" ");
})();

const [count, freq, bmin, bmax] = await runner
  .run(freqCommand)
  .then((s) => s.split(" "));
const bminNum = Number(bmin);
const bmaxNum = Number(bmax);
const countNum = Number(count);
const frequency: { [key: string]: number } = freq.split("|").filter((s) =>
  s !== ""
)
  .map((s) => s.split("_"))
  .reduce((a, c) => {
    return { ...a, [c[0]]: Number(c[1]) };
  }, {});
const maxKeySpace = `${bmaxNum * binSize}-${(bmaxNum + 1) * binSize}`.length;
const { println, showHeader, hr } = formatter(
  maxKeySpace,
  getMaxNumLength(frequency) + 6,
);

hasHeader ? showHeader(headerName) : hr();
console.log(`binSize: ${binSize}`);
hr();

for (let i = bminNum; i <= bmaxNum; ++i) {
  const f = frequency[i] || 0;
  const rank = Math.round(f / countNum * 100);
  rank >= filterRank && println(
    `${i * binSize}-${(i + 1) * binSize}`,
    `${f}(${rank}%)`,
    rank,
  );
}
hr();

Deno.exit(0);
