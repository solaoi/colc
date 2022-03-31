// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";

const comma = (numStr: string) => {
  const s = numStr.split(".");
  let ret = (s[0]).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,").toString();
  if (s.length > 1) {
    ret += "." + s[1];
  }
  return ret;
};

const getMaxLength = (obj: { [key: string]: string }) => {
  return Object.values(obj).reduce((a, c) => c.length > a.length ? c : a, "")
    .length;
};

const getMaxNumLength = (obj: { [key: string]: bigint }) => {
  return Object.values(obj).reduce((a, c) =>
    c.toString().length > a.toString().length ? c : a
  )
    .toString().length;
};

const formatter = (keySpace: number, valueSpace: number, inverse = false) => {
  let sumRank = 0;
  return {
    hr: () => {
      const hr = "-".repeat(keySpace + valueSpace + 2);
      console.log(hr);
    },
    showHeader: (headerName: string) => {
      const hr = "-".repeat(keySpace + valueSpace + 2);
      console.log(`${hr}\n${chalk.green(headerName)}\n${hr}`);
    },
    println: (key: string, value: string, rank?: number) => {
      inverse = !inverse;
      const keySpaces = " ".repeat(keySpace - key.length);
      const valueSpaces = " ".repeat(valueSpace - value.length);
      const preGraph = rank ? "|" : "";
      const graph = rank ? " ".repeat(rank) : "";
      if (rank) {
        sumRank += rank;
      }
      const graphRank = rank ? ` ${sumRank}%` : "";
      if (inverse) {
        console.log(
          chalk.inverse(
            chalk.bold(key) + keySpaces + "| " + chalk.italic(value) +
              valueSpaces,
          ) + preGraph + chalk.bgCyanBright(graph) + graphRank,
        );
      } else {
        console.log(
          chalk.bold(key) + keySpaces + "| " + chalk.italic(value) +
            valueSpaces + preGraph +
            chalk.bgCyan(graph) + graphRank,
        );
      }
    },
  };
};

export { comma, formatter, getMaxLength, getMaxNumLength };
