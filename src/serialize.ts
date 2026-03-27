/**
 * HTML element and attribute serialization utilities.
 * @module
 */

import { escapeAttr } from "./escape.ts";

export const VOID_ELEMENTS = new Set([
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
]);

export const BOOLEAN_ATTRS = new Set([
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
]);

/**
 * Checks if a tag name is a void element (HTML void elements have no end tag).
 * @param tagName - The HTML tag name to check.
 * @returns True if the element is a void element.
 */
export function isVoid(tagName: string): boolean {
  return VOID_ELEMENTS.has(tagName);
}

/**
 * Serializes element props to an HTML attribute string.
 * Attributes are sorted alphabetically for deterministic output.
 * @param props - The props object (or null).
 * @returns A string like ` class="foo" href="/"`, or empty string.
 */
export function serializeProps(
  props: Record<string, unknown> | null,
): string {
  if (props === null) {
    return "";
  }

  const parts: string[] = [];

  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (key === "children" || key === "key") {
      continue;
    }

    if (key === "className") {
      if (typeof value === "string" && value !== "") {
        parts.push(` class="${escapeAttr(value)}"`);
      }
      continue;
    }

    if (BOOLEAN_ATTRS.has(key)) {
      if (value === true) {
        parts.push(` ${key}`);
      }
      continue;
    }

    if (typeof value === "boolean") {
      continue;
    }

    if (typeof value === "string") {
      parts.push(` ${key}="${escapeAttr(value)}"`);
      continue;
    }

    if (typeof value === "number") {
      parts.push(` ${key}="${escapeAttr(String(value))}"`);
      continue;
    }
  }

  parts.sort((a, b) => {
    const aKey = a.match(/^\s+([^=]+)/)?.[1] ?? "";
    const bKey = b.match(/^\s+([^=]+)/)?.[1] ?? "";
    return aKey.localeCompare(bKey);
  });

  return parts.join("");
}
