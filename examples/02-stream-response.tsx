import { renderToReadableStream } from "@ggpwnkthx/ssr";

const hostname = "127.0.0.1";
const port = 8000;

Deno.serve({ hostname, port }, () => {
  const page = (
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Streaming SSR</title>
      </head>
      <body>
        <h1>Streaming page</h1>
        <p>This HTML is streamed from renderToReadableStream().</p>
        <input
          type="text"
          disabled
          value="boolean attrs render bare"
        />
        <br />
        <img src="/logo.png" alt="logo" />
      </body>
    </html>
  );

  return new Response(renderToReadableStream(page), {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
});

console.log(`Listening on http://${hostname}:${port}/`);
