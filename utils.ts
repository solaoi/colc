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

export { comma, help };
