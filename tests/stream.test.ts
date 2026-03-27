/**
 * Tests for streaming VNode rendering.
 */

import { assertEquals } from "@std/assert";
import { renderToReadableStream } from "../src/render-to-stream.ts";
import { renderToString } from "../src/render-to-string.ts";
import {
  createElementVNode,
  createFragmentVNode,
  createTextVNode,
} from "@ggpwnkthx/jsx";

async function collectStream(stream: ReadableStream<Uint8Array>): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(result);
}

Deno.test("renderToReadableStream produces multiple chunks", async () => {
  const vnode = createElementVNode("div", { id: "test" }, null, [
    createTextVNode("Hello"),
  ]);
  const stream = renderToReadableStream(vnode);
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  assertEquals(chunks.length > 1, true, "should produce multiple chunks");
});

Deno.test("renderToReadableStream matches renderToString output", async () => {
  const vnode = createElementVNode("div", { id: "test" }, null, [
    createTextVNode("Hello"),
    createElementVNode("br", null, null, []),
  ]);
  const stringOutput = renderToString(vnode);
  const streamOutput = await collectStream(renderToReadableStream(vnode));
  assertEquals(streamOutput, stringOutput);
});

Deno.test("renderToReadableStream preserves hydration markers", async () => {
  const vnode = createElementVNode("div", null, null, [
    createElementVNode("span", null, null, []),
    createElementVNode("span", null, null, []),
  ]);
  const streamOutput = await collectStream(renderToReadableStream(vnode));
  assertEquals(streamOutput.includes('data-hk="0"'), true);
  assertEquals(streamOutput.includes('data-hk="0.0"'), true);
  assertEquals(streamOutput.includes('data-hk="0.1"'), true);
});

Deno.test("renderToReadableStream escapes correctly", async () => {
  const vnode = createElementVNode(
    "div",
    {
      title: 'foo "bar"',
    },
    null,
    [
      createTextVNode("<script>alert(1)</script>"),
    ],
  );
  const stringOutput = renderToString(vnode);
  const streamOutput = await collectStream(renderToReadableStream(vnode));
  assertEquals(streamOutput, stringOutput);
});

Deno.test("renderToReadableStream handles fragments", async () => {
  const children = [
    createTextVNode("text"),
    createElementVNode("div", null, null, []),
  ];
  const fragment = createFragmentVNode(null, children);
  const stringOutput = renderToString(fragment);
  const streamOutput = await collectStream(renderToReadableStream(fragment));
  assertEquals(streamOutput, stringOutput);
});

Deno.test("renderToReadableStream handles void elements", async () => {
  const vnode = createElementVNode("div", null, null, [
    createElementVNode("br", null, null, []),
    createElementVNode("hr", null, null, []),
    createElementVNode("img", { src: "x" }, null, []),
  ]);
  const stringOutput = renderToString(vnode);
  const streamOutput = await collectStream(renderToReadableStream(vnode));
  assertEquals(streamOutput, stringOutput);
});

Deno.test("renderToReadableStream throws on ComponentVNode", async () => {
  const componentVNode = {
    kind: "component" as const,
    type: () => createElementVNode("div", null, null, []),
    props: null,
    key: null,
    children: [],
  };
  try {
    for await (
      const _chunk of renderToReadableStream(
        componentVNode as Parameters<typeof renderToReadableStream>[0],
      )
    ) {
      // consume stream
    }
    throw new Error("Expected TypeError was not thrown");
  } catch (e) {
    assertEquals(e instanceof TypeError, true);
    assertEquals(
      (e as TypeError).message,
      "ComponentVNode is not supported by this renderer",
    );
  }
});
