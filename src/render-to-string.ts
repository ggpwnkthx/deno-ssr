/**
 * Core VNode rendering to HTML string.
 * @module
 */

import { isElementVNode, type VNode } from "@ggpwnkthx/jsx";

import { renderChunks } from "./chunks.ts";

export function renderToString(vnode: VNode): string {
  const rootPath = isElementVNode(vnode) ? [0] : [];
  let html = "";
  for (const chunk of renderChunks(vnode, rootPath)) {
    html += chunk;
  }
  return html;
}
