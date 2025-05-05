# backend-cloudflare

Example proxied and auth'd xrpc proxy which runs separately from authr,
for example an appview server on cloudflare.

You'll need
- a Cloudflare KV setup,
- another tunnel host like "api" in addition to "app" and "auth"

```txt
pnpm install
pnpm run dev
```

```txt
pnpm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
pnpm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
