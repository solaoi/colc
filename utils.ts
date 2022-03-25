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

const animeFrame = ["\\", "|", "/", "-"];
const textEncoder = new TextEncoder();
const startLoading = () => {
  let x = 0;
  return setInterval(() => {
    Deno.stdout.writeSync(textEncoder.encode(`\r${animeFrame[x++]}`));
    x %= animeFrame.length;
  }, 250);
};
const stopLoading = (loader: number) => {
  clearInterval(loader);
  Deno.stdout.writeSync(textEncoder.encode("\u001b[1G\u001b[2K"));
};

export { comma, help, startLoading, stopLoading };
