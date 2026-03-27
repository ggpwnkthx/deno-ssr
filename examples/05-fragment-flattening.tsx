// deno-lint-ignore-file jsx-no-useless-fragment
import { renderToString } from "@ggpwnkthx/ssr";

const html = renderToString(
  <div>
    <>
      <a>first</a>
      <b>second</b>
    </>
    <c>third</c>
  </div>,
);

console.log(html);
