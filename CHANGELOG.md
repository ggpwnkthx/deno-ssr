# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-03-27

### Documentation

- Added JSDoc documentation to all exported symbols: `renderToString`, `renderToReadableStream`, `VOID_ELEMENTS`, `BOOLEAN_ATTRS`, `renderChunks`

## [0.1.0] - 2026-03-27

### Added

- `src/mod.ts` - Public exports for `renderToString` and `renderToReadableStream`
- `src/escape.ts` - `escapeText()` and `escapeAttr()` for HTML-safe text and attribute values
- `src/serialize.ts` - `serializeProps()`, `isVoid()`, `VOID_ELEMENTS`, and `BOOLEAN_ATTRS`
- `src/chunks.ts` - Shared generator-based VNode traversal for consistent rendering
- `src/render-to-string.ts` - `renderToString()` for HTML string rendering with hydration markers
- `src/render-to-stream.ts` - `renderToReadableStream()` for incremental streaming HTML rendering
- `tests/escape.test.ts` - Tests for text and attribute escaping
- `tests/serialize.test.ts` - Tests for HTML element and attribute serialization
- `tests/render.test.ts` - Tests for VNode rendering to HTML
- `tests/hydration.test.ts` - Tests for hydration marker injection and path assignment
- `tests/stream.test.ts` - Tests for streaming renderer output parity
- `examples/` - Runnable examples demonstrating SSR: document rendering, streaming server, escaping, hydration markers, fragment flattening, and string/stream parity

### Fixed

- Fragment sibling index collision: fragment children now share parent's sibling counter so nested elements get unique paths
- Malformed `data-hk` attribute: closing quote was missing in stream renderer
- Root element path initialization: both renderers now start root elements at path `[0]`
- Stream backpressure: renderer respects `controller.desiredSize` and yields chunks incrementally
- Attribute serialization: added denylist for internal props (`children`, `key`)
- Deterministic attribute ordering: attributes are now sorted alphabetically
- Void element comment: corrected misleading "self-closing" to "no end tag" terminology

### Changed

- Extracted shared traversal logic to `src/chunks.ts` to prevent renderer drift
- `renderToString()` now uses incremental string building instead of `Array.from().join("")`
- `renderToReadableStream()` now uses persistent iterator with proper backpressure handling
- Lint task no longer references nonexistent `benchmarks/` and `examples/` directories
