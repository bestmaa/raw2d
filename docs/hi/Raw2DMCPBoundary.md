# Raw2D MCP Boundary

`raw2d-mcp` explicit scene automation ke liye hai. Ye agents ko Raw2D scene create, validate, inspect, aur explain karne me help karta hai, bina project ko chupke control kiye.

## Allowed Behavior

- Scene JSON return karna.
- Validation aur inspection result return karna.
- Generated TypeScript aur markdown string return karna.
- Visual check aur export audit ke command plans return karna.
- Duplicate ya missing object id par clear error dena.

## Disallowed Behavior

- Separate explicit tool ke bina project files write nahi karna.
- npm package publish nahi karna.
- Git commits push nahi karna.
- Scene data upload ya external service call nahi karna.
- Browser internally control nahi karna.
- Generated code caller se hide nahi karna.

## Agent Workflow

1. Scene JSON create ya update karo.
2. Scene JSON validate karo.
3. Examples ya docs snippets generate karo.
4. Generated output user ya caller ko dikhao.
5. Visual-check commands sirf host environment se run karo.

## Public Surface

MCP package small aur deterministic rehna chahiye. Har tool plain data return kare jo Node unit tests se verify ho sake.
