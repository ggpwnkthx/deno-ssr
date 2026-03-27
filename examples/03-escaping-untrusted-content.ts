import { renderToString } from "@ggpwnkthx/ssr";
import { createElementVNode, createTextVNode } from "@ggpwnkthx/jsx";

const textVNode = createElementVNode("div", null, null, [
  createTextVNode(`<script>alert('xss')</script>`),
]);

const attrVNode = createElementVNode(
  "div",
  {
    title: `"quoted" & escaped 'too'`,
  },
  null,
  [],
);

console.log(renderToString(textVNode));

console.log(renderToString(attrVNode));
