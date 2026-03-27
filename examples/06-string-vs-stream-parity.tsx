import { renderToReadableStream, renderToString } from "@ggpwnkthx/ssr";

async function collectStream(stream: ReadableStream<Uint8Array>): Promise<string> {
  const chunks: Uint8Array[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return new TextDecoder().decode(result);
}

const vnode = (
  <div id="parity-check">
    Hello
    <br />
    World
  </div>
);

const stringOutput = renderToString(vnode);
const streamOutput = await collectStream(renderToReadableStream(vnode));

if (stringOutput !== streamOutput) {
  throw new Error(
    `String and stream output differ.\nstring: ${stringOutput}\nstream: ${streamOutput}`,
  );
}

console.log("Outputs match: true");
console.log(stringOutput);
