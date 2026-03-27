/**
 * Tests for hydration marker injection and path assignment.
 */

import { assertEquals } from "@std/assert";
import { renderToString } from "../src/render-to-string.ts";
import {
  createElementVNode,
  createFragmentVNode,
  createTextVNode,
} from "@ggpwnkthx/jsx";

Deno.test("root element gets path 0", () => {
  const vnode = createElementVNode("div", null, null, []);
  assertEquals(renderToString(vnode), `<div data-hk="0"></div>`);
});

Deno.test("first child element gets path [0]", () => {
  const child = createElementVNode("span", null, null, []);
  const vnode = createElementVNode("div", null, null, [child]);
  assertEquals(
    renderToString(vnode),
    `<div data-hk="0"><span data-hk="0.0"></span></div>`,
  );
});

Deno.test("nested children get dot-separated paths", () => {
  const deepChild = createElementVNode("em", null, null, []);
  const child = createElementVNode("span", null, null, [deepChild]);
  const root = createElementVNode("div", null, null, [child]);
  assertEquals(
    renderToString(root),
    `<div data-hk="0"><span data-hk="0.0"><em data-hk="0.0.0"></em></span></div>`,
  );
});

Deno.test("sibling elements get sequential indices", () => {
  const children = [
    createElementVNode("div", null, null, []),
    createElementVNode("div", null, null, []),
    createElementVNode("div", null, null, []),
  ];
  const root = createElementVNode("parent", null, null, children);
  assertEquals(
    renderToString(root),
    `<parent data-hk="0"><div data-hk="0.0"></div><div data-hk="0.1"></div><div data-hk="0.2"></div></parent>`,
  );
});

Deno.test("text nodes do not get markers", () => {
  const vnode = createElementVNode("div", null, null, [createTextVNode("hello")]);
  const html = renderToString(vnode);
  assertEquals(html, `<div data-hk="0">hello</div>`);
  assertEquals(html.includes("data-hk="), true);
});

Deno.test("text nodes do not consume path index", () => {
  const children = [
    createTextVNode("skip"),
    createElementVNode("div", null, null, []),
    createTextVNode("skip"),
    createElementVNode("span", null, null, []),
  ];
  const root = createElementVNode("parent", null, null, children);
  assertEquals(
    renderToString(root),
    `<parent data-hk="0">skip<div data-hk="0.0"></div>skip<span data-hk="0.1"></span></parent>`,
  );
});

Deno.test("void elements get markers", () => {
  const vnode = createElementVNode("div", null, null, [
    createElementVNode("br", null, null, []),
    createElementVNode("hr", null, null, []),
    createElementVNode("img", { src: "x" }, null, []),
  ]);
  assertEquals(
    renderToString(vnode),
    `<div data-hk="0"><br data-hk="0.0"><hr data-hk="0.1"><img src="x" data-hk="0.2"></div>`,
  );
});

Deno.test("keyless fragment flattens children without path collision", () => {
  const fragment = createFragmentVNode(null, [
    createElementVNode("div", null, null, []),
    createElementVNode("span", null, null, []),
  ]);
  assertEquals(
    renderToString(fragment),
    `<div data-hk="0"></div><span data-hk="1"></span>`,
  );
});

Deno.test("fragment example from plan: <><div><img/></div><span/></>", () => {
  const fragment = createFragmentVNode(null, [
    createElementVNode("div", null, null, [
      createElementVNode("img", null, null, []),
    ]),
    createElementVNode("span", null, null, []),
  ]);
  const html = renderToString(fragment);
  assertEquals(html.includes('data-hk="0"'), true);
  assertEquals(html.includes('data-hk="0.0"'), true);
  assertEquals(html.includes('data-hk="1"'), true);
});

Deno.test("fragment children share sibling index with outer siblings", () => {
  const vnode = createElementVNode("div", null, null, [
    createFragmentVNode(null, [
      createElementVNode("a", null, null, []),
      createElementVNode("b", null, null, []),
    ]),
    createElementVNode("c", null, null, []),
  ]);
  const html = renderToString(vnode);
  assertEquals(html.includes('data-hk="0"'), true);
  assertEquals(html.includes('data-hk="0.0"'), true);
  assertEquals(html.includes('data-hk="0.1"'), true);
  assertEquals(html.includes('data-hk="0.2"'), true);
});

Deno.test("deeply nested void elements", () => {
  const vnode = createElementVNode("div", null, null, [
    createElementVNode("p", null, null, [
      createElementVNode("input", { type: "text" }, null, []),
      createElementVNode("br", null, null, []),
      createElementVNode("input", { type: "hidden" }, null, []),
    ]),
  ]);
  assertEquals(
    renderToString(vnode),
    `<div data-hk="0"><p data-hk="0.0"><input type="text" data-hk="0.0.0"><br data-hk="0.0.1"><input type="hidden" data-hk="0.0.2"></p></div>`,
  );
});

Deno.test("mixed content with deep nesting", () => {
  const vnode = createElementVNode("html", null, null, [
    createElementVNode("head", null, null, [
      createElementVNode("meta", { charset: "utf-8" }, null, []),
      createElementVNode("title", null, null, [createTextVNode("Test")]),
    ]),
    createElementVNode("body", null, null, [
      createElementVNode("h1", null, null, [createTextVNode("Hello")]),
      createElementVNode("p", null, null, [
        createTextVNode("Text before"),
        createElementVNode("br", null, null, []),
        createTextVNode("Text after"),
      ]),
    ]),
  ]);
  const html = renderToString(vnode);
  assertEquals(html.includes('data-hk="0"'), true);
  assertEquals(html.includes('data-hk="0.0"'), true);
  assertEquals(html.includes('data-hk="0.0.0"'), true);
  assertEquals(html.includes('data-hk="0.1"'), true);
  assertEquals(html.includes('data-hk="0.1.0"'), true);
  assertEquals(html.includes('data-hk="0.1.1"'), true);
  assertEquals(html.includes('data-hk="0.1.1.0"'), true);
});
