/**
 * Text and attribute escaping for HTML serialization.
 * @module
 */

/**
 * Escapes `&`, `<`, and `>` for safe text content.
 * @param value - The text to escape.
 * @returns Escaped text safe for HTML text nodes.
 */
export function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Escapes `&`, `<`, `>`, `"`, and `'` for safe attribute values.
 * @param value - The attribute value to escape.
 * @returns Escaped text safe for HTML attribute values.
 */
export function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
