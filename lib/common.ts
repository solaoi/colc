const animeFrame = ["\\", "|", "/", "-"];
const textEncoder = new TextEncoder();
const startLoading = () => {
  let x = 0;
  return setInterval(() => {
    Deno.writeSync(Deno.stdout.rid, textEncoder.encode(`\r${animeFrame[x++]}`));
    x %= animeFrame.length;
  }, 250);
};
const stopLoading = (loader: number) => {
  clearInterval(loader);
  Deno.writeSync(Deno.stdout.rid, textEncoder.encode("\u001b[1G\u001b[2K"));
};

const runner = {
  run: async (command: string): Promise<string> => {
    const loader = startLoading();

    const p = Deno.run({
      cmd: ["bash", "-c", command],
      stdout: "piped",
      stderr: "piped",
    });

    const code = await p.status().then((s) => {
      stopLoading(loader);
      return s.code;
    });

    if (code === 0) {
      return await p
        .output().then(
          (s) => new TextDecoder().decode(s),
        );
    } else {
      const rawError = await p.stderrOutput();
      const errorString = new TextDecoder().decode(rawError);
      console.log(errorString);
      Deno.exit(1);
    }
  },
};

export { runner };
