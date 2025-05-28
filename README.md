# Blebbit Authnz Service

consider this alpha software, though we are using it in production ourselves


## Dev Setup

- pnpm
- docker & compose
- Cloudflare

Setup Cloudflare

1. tunnel for a domain and subdomains
  1. auth.. -> localhost:3333
  2. api.. -> localhost:3001
  3. app.. -> localhost:3000
2. KV and D1 for AppView (api / backend-cloudflare)

With external stuff setup, this is pretty close to the steps needed

```sh
# auth.domain.com
cd services/authr
make dc.up
pnpm i

## create jwks keys
pnpm genkey keyname-1
pnpm genkey keyname-2
(edit .env)

pnpm run dev

# api.domain.com
cd examples/backend-cloudflare
pnpm i
(edit .dev.vars)
pnpm run db:mig:apply:local
zed apply .... perms/posts.zed
pnpm run dev

# app.domain.com
cd examples/frontend-tanstack
pnpm i
(edit .env)
pnpm run dev
```


