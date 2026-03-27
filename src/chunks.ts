/**
 * Shared VNode traversal that yields HTML string chunks.
 * Used by both string and stream renderers.
 * @module
 */

import {
  type ElementVNode,
  type FragmentVNode,
  isComponentVNode,
  isElementVNode,
  isFragmentVNode,
  isTextVNode,
  type VNode,
} from "@ggpwnkthx/jsx";

import { escapeText } from "./escape.ts";
import { isVoid, serializeProps } from "./serialize.ts";

export function* renderChunks(
  vnode: VNode,
  path: number[],
): Generator<string> {
  if (isElementVNode(vnode)) {
    yield* renderElementChunk(vnode, path);
    return;
  }
  if (isTextVNode(vnode)) {
    yield escapeText(vnode.type);
    return;
  }
  if (isFragmentVNode(vnode)) {
    yield* renderFragmentChunk(vnode, path, { index: 0 });
    return;
  }
  if (isComponentVNode(vnode)) {
    throw new TypeError(
      "ComponentVNode is not supported by this renderer",
    );
  }
  throw new TypeError(`Unknown VNode kind: ${(vnode as VNode).kind}`);
}

function* renderElementChunk(
  vnode: ElementVNode,
  path: number[],
): Generator<string> {
  const tag = vnode.type;
  const attrs = serializeProps(vnode.props);
  const marker = ` data-hk="${path.join(".")}"`;

  if (isVoid(tag)) {
    yield `<${tag}${attrs}${marker}>`;
    return;
  }

  yield `<${tag}${attrs}${marker}>`;
  yield* renderChildrenChunk(vnode.children, path, { index: 0 });
  yield `</${tag}>`;
}

function* renderFragmentChunk(
  vnode: FragmentVNode,
  parentPath: number[],
  counter: { index: number },
): Generator<string> {
  yield* renderChildrenChunk(vnode.children, parentPath, counter);
}

function* renderChildrenChunk(
  children: VNode[],
  parentPath: number[],
  counter: { index: number },
): Generator<string> {
  for (const child of children) {
    if (isElementVNode(child)) {
      const childPath = [...parentPath, counter.index];
      yield* renderElementChunk(child, childPath);
      counter.index++;
    } else if (isTextVNode(child)) {
      yield escapeText(child.type);
    } else if (isFragmentVNode(child)) {
      yield* renderFragmentChunk(child, parentPath, counter);
    } else if (isComponentVNode(child)) {
      throw new TypeError(
        "ComponentVNode is not supported by this renderer",
      );
    } else {
      throw new TypeError(`Unknown VNode kind: ${(child as VNode).kind}`);
    }
  }
}
