# Examples for `@ggpwnkthx/ssr`

These examples are small, runnable programs that demonstrate the current SSR
behavior of `@ggpwnkthx/ssr` with VNode helpers from
`jsr:@ggpwnkthx/jsx@0.1.3`.

## Covered behaviors

- Deterministic `data-hk` hydration markers on element nodes
- Fragment flattening without wrapper elements
- Escaping for text and attribute values
- Void element serialization without closing tags
- Alphabetical attribute ordering with `className` normalized to `class`
- Boolean attributes emitted as bare names

## Run examples

No permissions required:

```sh
deno run examples/01-render-document.tsx
deno run examples/03-escaping-untrusted-content.ts
deno run examples/04-hydration-markers.tsx
deno run examples/05-fragment-flattening.tsx
deno run examples/06-string-vs-stream-parity.tsx
```

Network permission required for the streaming server example:

```sh
deno run --allow-net=127.0.0.1:8000 examples/02-stream-response.tsx
```

Then open http://127.0.0.1:8000/.

## Files

### 01-render-document.tsx

Renders a complete HTML document with nested elements, text nodes, and void
elements. Uses JSX syntax for a natural HTML-like structure. Shows deterministic
attribute ordering and hydration markers on every emitted element.

### 02-stream-response.tsx

Starts a local Deno server on 127.0.0.1:8000 and streams the rendered HTML
through `renderToReadableStream()`. Demonstrates JSX in a real HTTP handler.

### 03-escaping-untrusted-content.ts

Shows how text content and attribute values are escaped. Each independent call
to `renderToString()` starts a new root path, so each output line begins with
`data-hk="0"`. Uses explicit VNode helpers (`.ts` file) to keep escaping logic
unambiguous.

### 04-hydration-markers.tsx

Demonstrates the `data-hk` path format for a deeply nested tree. Uses JSX for
clear element hierarchy.

### 05-fragment-flattening.tsx

Shows that fragment children flatten into sibling output and continue the same
sibling counter as surrounding element children. JSX `<>` fragments are used.

### 06-string-vs-stream-parity.tsx

Collects the streamed output, decodes it, and verifies it exactly matches
`renderToString()`. Uses JSX for the vnode tree.

## Notes

These examples intentionally avoid `ComponentVNode`, because the current
renderer throws `TypeError` for component nodes.

The examples use pinned `jsr:` imports to match the package surface described
in the repository.
