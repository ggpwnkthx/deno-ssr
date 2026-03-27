/**
 * Tests for HTML attribute and element serialization.
 */

import { assertEquals } from "@std/assert";
import {
  BOOLEAN_ATTRS,
  isVoid,
  serializeProps,
  VOID_ELEMENTS,
} from "../src/serialize.ts";

Deno.test("VOID_ELEMENTS contains expected elements", () => {
  const expected = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ];
  for (const el of expected) {
    assertEquals(VOID_ELEMENTS.has(el), true, `${el} should be void`);
  }
});

Deno.test("VOID_ELEMENTS does not contain non-void elements", () => {
  const nonVoid = ["div", "span", "p", "a", "button"];
  for (const el of nonVoid) {
    assertEquals(VOID_ELEMENTS.has(el), false, `${el} should not be void`);
  }
});

Deno.test("isVoid returns true for void elements", () => {
  assertEquals(isVoid("br"), true);
  assertEquals(isVoid("img"), true);
  assertEquals(isVoid("input"), true);
  assertEquals(isVoid("meta"), true);
});

Deno.test("isVoid returns false for non-void elements", () => {
  assertEquals(isVoid("div"), false);
  assertEquals(isVoid("span"), false);
  assertEquals(isVoid("a"), false);
});

Deno.test("BOOLEAN_ATTRS contains expected attributes", () => {
  const expected = [
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "seamless",
    "selected",
  ];
  for (const attr of expected) {
    assertEquals(BOOLEAN_ATTRS.has(attr), true, `${attr} should be boolean`);
  }
});

Deno.test("BOOLEAN_ATTRS does not contain non-boolean attributes", () => {
  const nonBool = ["href", "src", "class", "id", "value"];
  for (const attr of nonBool) {
    assertEquals(BOOLEAN_ATTRS.has(attr), false, `${attr} should not be boolean`);
  }
});

Deno.test("serializeProps omits null props", () => {
  assertEquals(serializeProps(null), "");
});

Deno.test("serializeProps omits nullish attribute values", () => {
  assertEquals(serializeProps({ href: null, id: undefined }), "");
});

Deno.test("serializeProps serializes string attributes", () => {
  assertEquals(serializeProps({ href: "/foo", id: "bar" }), ` href="/foo" id="bar"`);
});

Deno.test("serializeProps serializes number attributes", () => {
  assertEquals(
    serializeProps({ tabIndex: 0, maxLength: 100 }),
    ` maxLength="100" tabIndex="0"`,
  );
});

Deno.test("serializeProps normalizes className to class", () => {
  assertEquals(serializeProps({ className: "foo bar" }), ` class="foo bar"`);
});

Deno.test("serializeProps omits empty className", () => {
  assertEquals(serializeProps({ className: "" }), "");
});

Deno.test("serializeProps serializes boolean true attributes", () => {
  assertEquals(
    serializeProps({ disabled: true, readonly: true }),
    ` disabled readonly`,
  );
});

Deno.test("serializeProps omits boolean false attributes", () => {
  assertEquals(serializeProps({ disabled: false, checked: false }), "");
});

Deno.test("serializeProps omits non-boolean/non-string/non-number values", () => {
  assertEquals(
    serializeProps({ disabled: false, href: "/foo", data: {} as unknown }),
    ` href="/foo"`,
  );
});

Deno.test("serializeProps escapes attribute values", () => {
  assertEquals(
    serializeProps({ title: 'foo & "bar"' }),
    ` title="foo &amp; &quot;bar&quot;"`,
  );
});

Deno.test("serializeProps handles mixed valid and null values", () => {
  assertEquals(
    serializeProps({ href: "/", className: "active", disabled: null, id: undefined }),
    ` class="active" href="/"`,
  );
});
