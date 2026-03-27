/**
 * Streaming VNode rendering to ReadableStream.
 * @module
 */

import { isElementVNode, type VNode } from "@ggpwnkthx/jsx";

import { renderChunks } from "./chunks.ts";

/**
 * Renders a VNode to a ReadableStream of HTML bytes.
 * @param vnode - The VNode to render.
 * @returns A ReadableStream yielding HTML chunks with hydration markers.
 */
export function renderToReadableStream(
  vnode: VNode,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const rootPath = isElementVNode(vnode) ? [0] : [];
  let iterator: Iterator<string> | undefined;

  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (!iterator) iterator = renderChunks(vnode, rootPath);

      while ((controller.desiredSize ?? 0) > 0) {
        const result = iterator.next();
        if (result.done) {
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(result.value));
      }
    },
  });
}
