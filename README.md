# @ggpwnkthx/ssr

[![Deno v2.7+](https://img.shields.io/badge/Deno-2.7+-lightgrey?logo=deno)](https://deno.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Server-side HTML rendering for normalized VNode trees with hydration marker support.

## Features

- **Text and attribute escaping** — Safe HTML output from user-provided content
- **Void element serialization** — Correct `<br>` not `<br/>` or `<br></br>`
- **Boolean attribute handling** — Omitted when false, present when true
- **Fragment and element recursion** — Handles nested components and fragments
- **Hydration marker injection** — `data-hk` attributes for client hydration alignment
- **String and stream rendering** — `renderToString()` and `renderToReadableStream()`
- **Deterministic output** — Canonical attribute ordering, stable tree paths

## Installation

```bash
deno add jsr:@ggpwnkthx/ssr
```

Or import directly:

```typescript
import { renderToReadableStream, renderToString } from "jsr:@ggpwnkthx/ssr@0.1.0";
```

## Usage

### String Rendering

```typescript
import { renderToString } from "jsr:@ggpwnkthx/ssr@0.1.0";

const html = renderToString(vnode);
```

### Stream Rendering

```typescript
import { renderToReadableStream } from "jsr:@ggpwnkthx/ssr@0.1.0";

const stream = renderToReadableStream(vnode);
const response = new Response(stream, {
  headers: { "content-type": "text/html" },
});
```

### Creating VNodes

This package renders normalized VNodes from the `@ggpwnkthx/jsx` runtime:

```typescript
import { Fragment, jsx, jsxs } from "jsr:@ggpwnkthx/jsx@0.1.1";

const vnode = jsxs("div", {
  children: [
    jsx("h1", { children: "Hello" }),
    jsx("p", { children: "World" }),
  ],
});

const html = renderToString(vnode);
// => <div data-hk="0"><h1 data-hk="0.0">Hello</h1><p data-hk="0.1">World</p></div>
```

## API Reference

### `renderToString(vnode)`

Renders a VNode tree to an HTML string.

**Parameters:**

- `vnode` (`VNode`): The root VNode to render

**Returns:** `string` — The rendered HTML

**Throws:** `TypeError` if a `ComponentVNode` is encountered

### `renderToReadableStream(vnode)`

Renders a VNode tree to a `ReadableStream<Uint8Array>` of UTF-8 encoded HTML chunks.

**Parameters:**

- `vnode` (`VNode`): The root VNode to render

**Returns:** `ReadableStream<Uint8Array>` — Stream of HTML chunks

**Throws:** `TypeError` if a `ComponentVNode` is encountered

## Hydration Markers

Hydration markers use `data-hk` attributes with dot-separated tree paths:

```html
<html data-hk="0">
  <head data-hk="0.0"><title data-hk="0.0.0">Test</title></head>
  <body data-hk="0.1"><h1 data-hk="0.1.0">Hello</h1></body>
</html>
```

**Path semantics:**

- Zero-based child positions among emitted **element** nodes
- Text nodes do not receive markers and do not affect path assignment
- Fragment children share the parent sibling counter — elements inside fragments continue the sibling sequence
- Void elements (`<br>`, `<img>`, `<input>`, etc.) receive markers like non-void elements

## Project Structure

```
src/
├── mod.ts              # Public exports
├── escape.ts           # Text and attribute escaping
├── serialize.ts        # Props and element serialization
├── chunks.ts           # Shared VNode traversal generator
├── render-to-string.ts # String renderer
└── render-to-stream.ts # Stream renderer

tests/
├── escape.test.ts      # Escaping tests
├── serialize.test.ts   # Serialization tests
├── render.test.ts      # Core rendering tests
├── hydration.test.ts   # Hydration marker tests
└── stream.test.ts     # Stream renderer tests
```

## Examples

Runnable examples demonstrating key features:

```bash
deno run examples/01-render-document.tsx    # Full HTML document rendering
deno run examples/03-escaping-untrusted-content.ts  # XSS prevention
deno run --allow-net=127.0.0.1:8000 examples/02-stream-response.tsx  # Streaming server
```

See `examples/README.md` for the full list and descriptions.
