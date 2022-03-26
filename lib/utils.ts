// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";

const comma = (numStr: string) => {
  const s = numStr.split(".");
  let ret = String(s[0]).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  if (s.length > 1) {
    ret += "." + s[1];
  }
  return ret;
};

const help = () => {
  console.log("Usage:\n  colc [column] [file.csv|tsv|txt]");
  Deno.exit(1);
};

const getMaxLength = (obj: { [key: string]: string }) => {
  return Object.values(obj).reduce((a, c) => c.length > a.length ? c : a, "")
    .length;
};

const formatter = (keySpace: number, valueSpace: number, inverse = false) => {
  return {
    println: (key: string, value: string) => {
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
    },
  };
};

export { comma, formatter, getMaxLength, help };
