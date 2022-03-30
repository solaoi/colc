import {
  comma,
  formatter,
  getMaxLength,
  getMaxNumLength,
} from "./lib/utils.ts";
import { runner } from "./lib/common.ts";
import { parse } from "https://deno.land/std@0.66.0/flags/mod.ts";

const { _, binsize, b, filter, f, check, c } = parse(Deno.args);
const [column, filename] = _;
const hasTwoColumn = (() => {
  if (typeof column !== "string") return false;
  if (column.indexOf(",") === -1) return false;
  const columns = column.split(",");
  if (columns.length !== 2) return false;
  return Number.isInteger(parseInt(columns[0])) &&
    Number.isInteger(parseInt(columns[1]));
})();

if (
  (typeof column !== "number" && !hasTwoColumn) || typeof filename !== "string"
) {
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
const hasCheck: boolean = (() => {
  if (typeof check === "boolean") return check;
  if (typeof c === "boolean") return c;
  return false;
})();

const isCsv = filename.endsWith(".csv");
const headerName = await runner.run(
  `head -n 1 ${filename}| cut -f${column} ${isCsv ? "-d, " : ""}| tr -d 0-9.-`,
);
const hasHeader = headerName !== "";

if (hasTwoColumn) {
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
    bash.push("| awk");
    bash.push(
      `'BEGIN{OFMT="%.6f"}{split($1,col,",");asum+=col[1];a[NR]=col[1];bsum+=col[2];b[NR]=col[2]}END{amean=asum/NR;bmean=bsum/NR;for(i in a){as+=(a[i]-amean)^2;bs+=(b[i]-bmean)^2;sum+=(a[i]-amean)*(b[i]-bmean)};astddev=sqrt(as/NR);bstddev=sqrt(bs/NR);print sum/NR/astddev/bstddev}'`,
    );
    return bash.join(" ");
  })();
  const correlationCoefficient = await runner
    .run(statsCommand);
  const { println, showHeader, hr } = formatter(
    24,
    correlationCoefficient.length,
  );
  hasHeader ? showHeader(headerName) : hr();
  println("correlation-coefficient", correlationCoefficient);
  hr();
  Deno.exit(0);
}

if (hasCheck) {
  const checkCommand = (() => {
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
    bash.push(
      "| awk '{clean=($1 ~/^[0-9.-]+$/);if(!clean)exit}END{print clean}'",
    );
    return bash.join(" ");
  })();
  const result = await runner
    .run(checkCommand);
  const hasError = result === "0";
  if (hasError) {
    console.log("dirty:<");
    Deno.exit(1);
  }
  console.log("clean:D");
  Deno.exit(0);
}

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
      `'BEGIN{OFMT="%.6f"}NR==1{min=$1}{if(0==$1)zeros++;if($1<0)neg++;sum+=$1;d[NR]=$1}END{avg=sum/NR;for(i in d)s+=(d[i]-avg)^2;stddev=sqrt(s/(NR-1));q1=(3*d[int((NR-1)/4)+1]+d[int((NR-1)/4)+2])/4;q3=(d[int(3*(NR-1)/4)+1]+3*d[int(3*(NR-1)/4)+2])/4;iqr=q3-q1;stur=1+log(NR)/log(2);sturi=int(stur);sturges=stur>sturi?sturi+1:sturi;max=d[NR];range=max-min;sqrtnr=sqrt(NR);threerootnr=exp(log(NR)/3);print stddev,avg,sum,NR,max,min,sqrt(s/(NR-1))/sqrtnr,s/(NR-1),(NR%2)?d[(NR+1)/2]:(d[NR/2]+d[NR/2+1])/2,avg+stddev,avg-stddev,avg+2*stddev,avg-2*stddev,avg+3*stddev,avg-3*stddev,range/sturges,(3.5*stddev)/threerootnr,q1,q3,iqr,q1-1.5*iqr,q3+1.5*iqr,range/sqrtnr,2*iqr/threerootnr,range,zeros,zeros*100/NR,neg,neg*100/NR,stddev/avg}'`,
    );
    return bash.join(" ");
  })();

  const [
    stddev,
    mean,
    sum,
    count,
    max,
    min,
    stderr,
    variance,
    median,
    sigmaPlus1,
    sigmaMinus1,
    sigmaPlus2,
    sigmaMinus2,
    sigmaPlus3,
    sigmaMinus3,
    sturgesBinsize,
    scottBinsize,
    q1,
    q3,
    iqr,
    lf,
    uf,
    sqrtBinsize,
    fdBinsize,
    range,
    zeros,
    zeroRate,
    negatives,
    negativeRate,
    cv
  ] = await runner
    .run(statsCommand).then((s) => s.split(" "));
  const sturgesFormulaIsInvalid = count.split(".")[0].length <= 2 &&
    parseInt(count) < 30;
  const total = {
    "count": comma(count),
    "sum": comma(sum),
    "range": comma(range),
    "zeros": comma(zeros),
    "zeros(%)": comma(zeroRate),
    "negatives": comma(negatives),
    "negatives(%)": comma(negativeRate)
  }
  const stats = {
    "min": comma(min),
    "25%(Q1)": comma(q1),
    "median": comma(median),
    "mean": comma(mean),
    "75%(Q3)": comma(q3),
    "max": comma(max),
  };
  const iqrs = {
    "IQR(Q3-Q1)": comma(iqr),
    "Q1–(1.5*IQR)": comma(lf),
    "Q3+(1.5*IQR)": comma(uf),
  }
  const stds = {
    "stddev(σ)": comma(stddev),
    "stderr": comma(stderr),
    "CV(σ/mean)": comma(cv),
    "variance(σ^2)": comma(variance),
    "mean±σ(≒68%)": `${comma(sigmaMinus1)}, ${comma(sigmaPlus1)}`,
    "mean±2σ(≒95%)": `${comma(sigmaMinus2)}, ${comma(sigmaPlus2)}`,
    "mean±3σ(≒99%)": `${comma(sigmaMinus3)}, ${comma(sigmaPlus3)}`,
  }
  const recommendedBinsizes = {
    "binsize(Square-root)": sqrtBinsize,
    ...(!sturgesFormulaIsInvalid && { "binsize(Sturges')": sturgesBinsize }),
    "binsize(Scott's)": scottBinsize,
    "binsize(FD)": fdBinsize,
  }
  const { println, showHeader, hr } = formatter(
    sturgesFormulaIsInvalid ? 20 : 21,
    getMaxLength({...total,...stats,...iqrs,...stds,...recommendedBinsizes}),
  );
  hasHeader ? showHeader(headerName) : hr();
  Object.entries(total).forEach(([key, value]) => {
    println(key, value);
  });
  hr();
  Object.entries(stats).forEach(([key, value]) => {
    println(key, value);
  });
  hr();
  Object.entries(iqrs).forEach(([key, value]) => {
    println(key, value);
  });
  hr();
  Object.entries(stds).forEach(([key, value]) => {
    println(key, value);
  });
  hr();
  Object.entries(recommendedBinsizes).forEach(([key, value]) => {
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
    `'BEGIN{OFMT="%.6f"}{b=int($1/${binSize});a[b]++;bmax=b>bmax?b:bmax;bmin=b<bmin?b:bmin}END{freq="";for(i in a)freq=freq "|" i "_" a[i];print NR, freq, bmin, bmax}'`,
  );
  return bash.join(" ");
})();

const [count, freq, bmin, bmax] = await runner
  .run(freqCommand)
  .then((s) => s.split(" "));

const bminNum = bmin !== "" ? parseInt(bmin) : 0;
const bmaxNum = parseInt(bmax);
const frequency: { [key: string]: bigint } = freq.split("|").filter((s) =>
  s !== ""
)
  .map((s) => s.split("_"))
  .reduce((a, c) => {
    return { ...a, [c[0]]: BigInt(c[1]) };
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
  const f = frequency[i] || 0n;
  const rank = parseInt(((f * 100n) / BigInt(count)).toString());
  rank >= filterRank && println(
    `${i * binSize}-${(i + 1) * binSize}`,
    `${f}(${rank}%)`,
    rank,
  );
}
hr();

Deno.exit(0);
