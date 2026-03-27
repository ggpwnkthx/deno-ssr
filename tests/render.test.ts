/**
 * Tests for core VNode rendering.
 */

import { assertEquals, assertThrows } from "@std/assert";
import { renderToString } from "../src/render-to-string.ts";
import {
  createElementVNode,
  createFragmentVNode,
  createTextVNode,
} from "@ggpwnkthx/jsx";

Deno.test("renders basic element", () => {
  const vnode = createElementVNode("div", { id: "test" }, null, []);
  assertEquals(renderToString(vnode), `<div id="test" data-hk="0"></div>`);
});

Deno.test("renders element with text child", () => {
  const child = createTextVNode("Hello");
  const vnode = createElementVNode("div", null, null, [child]);
  assertEquals(renderToString(vnode), `<div data-hk="0">Hello</div>`);
});

Deno.test("renders element with multiple children", () => {
  const children = [
    createTextVNode("Hello"),
    createTextVNode("World"),
  ];
  const vnode = createElementVNode("p", null, null, children);
  assertEquals(renderToString(vnode), `<p data-hk="0">HelloWorld</p>`);
});

Deno.test("renders nested elements", () => {
  const inner = createElementVNode("span", null, null, [createTextVNode("inner")]);
  const outer = createElementVNode("div", null, null, [inner]);
  assertEquals(
    renderToString(outer),
    `<div data-hk="0"><span data-hk="0.0">inner</span></div>`,
  );
});

Deno.test("renders sibling elements with sequential paths", () => {
  const children = [
    createElementVNode("div", null, null, []),
    createElementVNode("div", null, null, []),
    createElementVNode("span", null, null, []),
  ];
  const vnode = createElementVNode("parent", null, null, children);
  assertEquals(
    renderToString(vnode),
    `<parent data-hk="0"><div data-hk="0.0"></div><div data-hk="0.1"></div><span data-hk="0.2"></span></parent>`,
  );
});

Deno.test("renders void elements without closing tag", () => {
  const vnode = createElementVNode("br", null, null, []);
  assertEquals(renderToString(vnode), `<br data-hk="0">`);
});

Deno.test("renders img void element", () => {
  const vnode = createElementVNode("img", { src: "foo.png", alt: "test" }, null, []);
  assertEquals(
    renderToString(vnode),
    `<img alt="test" src="foo.png" data-hk="0">`,
  );
});

Deno.test("renders input void element", () => {
  const vnode = createElementVNode("input", { type: "text", disabled: true }, null, []);
  assertEquals(
    renderToString(vnode),
    `<input disabled type="text" data-hk="0">`,
  );
});

Deno.test("renders fragment with children", () => {
  const children = [
    createElementVNode("div", null, null, [createTextVNode("first")]),
    createElementVNode("span", null, null, [createTextVNode("second")]),
  ];
  const fragment = createFragmentVNode(null, children);
  assertEquals(
    renderToString(fragment),
    `<div data-hk="0">first</div><span data-hk="1">second</span>`,
  );
});

Deno.test("renders keyed fragment", () => {
  const children = [
    createElementVNode("li", null, null, [createTextVNode("item1")]),
    createElementVNode("li", null, null, [createTextVNode("item2")]),
  ];
  const fragment = createFragmentVNode("list-key", children);
  assertEquals(
    renderToString(fragment),
    `<li data-hk="0">item1</li><li data-hk="1">item2</li>`,
  );
});

Deno.test("renders fragment with text nodes interleaved", () => {
  const children = [
    createTextVNode("text1"),
    createElementVNode("div", null, null, []),
    createTextVNode("text2"),
  ];
  const fragment = createFragmentVNode(null, children);
  assertEquals(
    renderToString(fragment),
    `text1<div data-hk="0"></div>text2`,
  );
});

Deno.test("throws on ComponentVNode", () => {
  const componentVNode = {
    kind: "component" as const,
    type: () => createElementVNode("div", null, null, []),
    props: null,
    key: null,
    children: [],
  };
  assertThrows(
    () => renderToString(componentVNode as Parameters<typeof renderToString>[0]),
    TypeError,
    "ComponentVNode is not supported by this renderer",
  );
});

Deno.test("escapes text content", () => {
  const vnode = createElementVNode("div", null, null, [
    createTextVNode("<script>alert('xss')</script>"),
  ]);
  assertEquals(
    renderToString(vnode),
    `<div data-hk="0">&lt;script&gt;alert('xss')&lt;/script&gt;</div>`,
  );
});

Deno.test("escapes attribute values", () => {
  const vnode = createElementVNode(
    "div",
    {
      title: 'foo "bar" <script>',
      dataValue: "test&value",
    },
    null,
    [],
  );
  assertEquals(
    renderToString(vnode),
    `<div dataValue="test&amp;value" title="foo &quot;bar&quot; &lt;script&gt;" data-hk="0"></div>`,
  );
});
