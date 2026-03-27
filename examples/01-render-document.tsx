import { renderToString } from "@ggpwnkthx/ssr";

const html = renderToString(
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Hello</title>
    </head>
    <body>
      <h1>Welcome</h1>
      <img src="/logo.png" alt="logo" />
    </body>
  </html>,
);

console.log(html);
