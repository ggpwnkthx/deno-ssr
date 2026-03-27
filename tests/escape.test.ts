/**
 * Tests for text and attribute escaping.
 */

import { assertEquals } from "@std/assert";
import { escapeAttr, escapeText } from "../src/escape.ts";

Deno.test("escapeText escapes ampersand", () => {
  assertEquals(escapeText("foo & bar"), "foo &amp; bar");
});

Deno.test("escapeText escapes less-than", () => {
  assertEquals(escapeText("<script>"), "&lt;script&gt;");
});

Deno.test("escapeText escapes greater-than", () => {
  assertEquals(escapeText("a > b"), "a &gt; b");
});

Deno.test("escapeText escapes multiple special chars", () => {
  assertEquals(
    escapeText("<div>foo & bar</div>"),
    "&lt;div&gt;foo &amp; bar&lt;/div&gt;",
  );
});

Deno.test("escapeText does not escape normal text", () => {
  assertEquals(escapeText("hello world"), "hello world");
});

Deno.test("escapeText handles empty string", () => {
  assertEquals(escapeText(""), "");
});

Deno.test("escapeAttr escapes ampersand", () => {
  assertEquals(escapeAttr("foo & bar"), "foo &amp; bar");
});

Deno.test("escapeAttr escapes less-than", () => {
  assertEquals(escapeAttr("<script>"), "&lt;script&gt;");
});

Deno.test("escapeAttr escapes greater-than", () => {
  assertEquals(escapeAttr("a > b"), "a &gt; b");
});

Deno.test("escapeAttr escapes double quote", () => {
  assertEquals(escapeAttr('href="foo"'), "href=&quot;foo&quot;");
});

Deno.test("escapeAttr escapes single quote", () => {
  assertEquals(escapeAttr("onclick='alert(1)'"), "onclick=&#39;alert(1)&#39;");
});

Deno.test("escapeAttr handles XSS vectors", () => {
  assertEquals(
    escapeAttr('"><script>alert(1)</script>'),
    "&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;",
  );
});

Deno.test("escapeAttr does not escape normal attribute values", () => {
  assertEquals(escapeAttr("hello world"), "hello world");
});

Deno.test("escapeAttr handles empty string", () => {
  assertEquals(escapeAttr(""), "");
});
