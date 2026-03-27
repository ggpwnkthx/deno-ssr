/**
 * Core VNode rendering to HTML string.
 * @module
 */

import { isElementVNode, type VNode } from "@ggpwnkthx/jsx";

import { renderChunks } from "./chunks.ts";

/**
 * Renders a VNode to an HTML string synchronously.
 * @param vnode - The VNode to render.
 * @returns Complete HTML string with hydration markers.
 */
export function renderToString(vnode: VNode): string {
  const rootPath = isElementVNode(vnode) ? [0] : [];
  let html = "";
  for (const chunk of renderChunks(vnode, rootPath)) {
    html += chunk;
  }
  return html;
}
