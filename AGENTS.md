# AGENTS.md

This document provides guidance for AI agents operating in this repository.

## Project Overview

- **Package**: `@ggpwnkthx/ssr` - Server-side HTML rendering for normalized VNode trees with hydration marker support
- **Target**: Deno v2.7+ only; no Node.js APIs
- **Key Deps**: `@ggpwnkthx/jsx@0.1.1` (JSX runtime), `@std/assert@1.0.19` (testing)

## Build/Lint/Test Commands

```bash
deno task test        # Run all tests with coverage
deno task coverage    # Generate LCOV report
deno task coverage:check  # Verify coverage thresholds
deno task bench       # Run benchmarks
deno task fmt         # Format code
deno task fmt:check   # Check formatting without modifying
deno task lint        # Lint code
deno task check       # Type-check all source files
deno task ci          # Run all CI checks (fmt && lint --fix && check && test)
```

### Single Test Execution

```bash
deno test -A ./tests/escape.test.ts              # Run specific test file
deno test -A --filter "escapeText" ./tests/      # Run by name (regex)
deno test -A --coverage=coverage ./tests/*       # Run with coverage
```

### Required Permissions

`--allow-read` | `--allow-write` | `--allow-net` | `--allow-env` | `--allow-ffi`

## Code Style Guidelines

### TypeScript

- **Strict mode always** - `strict: true` in deno.jsonc
- **Avoid `any`** - Use `unknown` + type narrowing
- **Prefer generics** over union types
- Use `interface` for object shapes; `type` for unions/intersections

### Imports

- Use jsr.io packages only; never `https://deno.land` imports
- Pin versions: `import { X } from "jsr:@scope/pkg@1.2.3";`
- Sort: external → internal → relative

### Formatting

```json
{ "lineWidth": 88, "indentWidth": 2, "useTabs": false, "semiColons": true,
  "singleQuote": false, "proseWrap": "preserve", "trailingCommas": "onlyMultiLine",
  "operatorPosition": "nextLine" }
```

### Naming Conventions

Files: `kebab-case.ts` | Types/Interfaces: `PascalCase` | Functions: `camelCase` | Constants: `SCREAMING_SNAKE_CASE` | Enums: `PascalCase` with `UPPER` values

### Error Handling

- Use typed errors with clear messages
- Define error class hierarchy for different failure modes
- Fail fast with validation errors
- Never swallow errors silently

## Documentation Standards

Every public entrypoint must have a module doc and all exported symbols need JSDoc:

```typescript
/**
 * Server-side HTML rendering for normalized VNode trees.
 * @module
 */

/**
 * Escapes `&`, `<`, and `>` for safe text content.
 * @param value - The text to escape.
 * @returns Escaped text safe for HTML text nodes.
 */
export function escapeText(value: string): string;
```

### No Slow Types

- Avoid `any` - use `unknown` + type narrowing
- Avoid large unions - use interfaces or generics
- Use `interface` for object shapes (faster for type checking)

## Architecture

```
src/
├── mod.ts              # Public exports
├── escape.ts           # Text and attribute escaping
├── serialize.ts        # Props and element serialization
├── chunks.ts           # Shared VNode traversal generator
├── render-to-string.ts # String renderer
└── render-to-stream.ts # Stream renderer
tests/                  # Test suite
examples/               # Runnable examples (see examples/README.md)
benchmarks/             # Performance benchmarks
```

### Memory Safety

- **Stream large I/O** - Use `AsyncIterable`, generators, cursors
- **Close resources explicitly** - Use `using` or try/finally

## Testing Guidelines

Tests use `@std/assert@1.0.19` under `tests/`:

```typescript
import { assertEquals, assertThrows } from "@std/assert@1.0.19";

Deno.test("myFeature works correctly", () => {
  assertEquals(myFeature(), expected);
});

Deno.test("invalid input throws TypedError", () => {
  assertThrows(() => myFunction(invalidInput), TypedError, "clear message");
});
```

## Dependency Policy

- **Minimal dependencies** - Prefer built-ins
- **Prefer jsr.io** - Always over deno.land/x
- **Pin versions** - Always (e.g., `@1.2.3`)

## Pull Request Checklist

- [ ] Branch from `main`
- [ ] Add/update tests for all changes
- [ ] Run `deno task ci` - all checks must pass
- [ ] Update README if public API changed
- [ ] Keep dependencies minimal
- [ ] Verify no `any` types introduced

## Git Conventions

- Commit messages: clear, descriptive, explain _why_ not just _what_
- AI-generated code: contributors responsible for reviewing all generated code
- Do not commit secrets, .env files, or private data

## Examples

```bash
deno run examples/01-render-document.tsx
deno run examples/03-escaping-untrusted-content.ts
deno run --allow-net=127.0.0.1:8000 examples/02-stream-response.tsx
```

See `examples/README.md` for full list.
