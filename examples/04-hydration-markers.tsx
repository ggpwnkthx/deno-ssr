import { renderToString } from "@ggpwnkthx/ssr";

const html = renderToString(
  <div>
    <header>
      <main>
        <button type="button">Click</button>
      </main>
    </header>
  </div>,
);

console.log(html);
