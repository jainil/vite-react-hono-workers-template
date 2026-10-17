# vite-react-hono-workers-template

This template provides a minimal setup for building a React application with TypeScript and Vite, designed to run on Cloudflare Workers. It features hot module replacement, Oxlint and Oxfmt integration, and the flexibility of Workers deployments.

![React + TypeScript + Vite + Cloudflare Workers](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fc7b4b62-442b-4769-641b-ad4422d74300/public)

<!-- dash-content-start -->

🚀 Supercharge your web development with this powerful stack:

- [**React**](https://react.dev/) - A modern UI library for building interactive interfaces
- [**Vite**](https://vite.dev/) - Lightning-fast build tooling and development server
- [**Hono**](https://hono.dev/) - Ultralight, modern backend framework
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing platform for global deployment

### ✨ Key Features

- 🔥 Hot Module Replacement (HMR) for rapid development
- 📦 TypeScript support out of the box
- 🛠️ Ultracite lint and format presets via Vite+
- ⚡ Zero-config deployment to Cloudflare's global network
- 🎯 API routes with Hono's elegant routing
- 🔄 Full-stack development setup
- 🔎 Built-in Observability to monitor your Worker

Get started in minutes with local development or deploy directly via the Cloudflare dashboard. Perfect for building modern, performant web applications at the edge.

<!-- dash-content-end -->

## Getting Started

Clone the private repository with an authenticated GitHub account:

```bash
gh repo clone jainil/vite-react-hono-workers-template
cd vite-react-hono-workers-template
```

## Development

Use pnpm `12.4.2` (pinned in `package.json`). Install dependencies:

```bash
pnpm install
```

Start the development server with:

```bash
pnpm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Production

Build your project for production:

```bash
pnpm run build
```

Preview your build locally:

```bash
pnpm run preview
```

Deploy your project to Cloudflare Workers:

```bash
pnpm run deploy
```

Monitor your Worker (Wrangler still provides live log streaming):

```bash
pnpm exec wrangler tail vite-react-hono-workers-template
```

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)

## Tooling and tests

Requires Node.js `^22.18.0 || ^24.11.0 || >=26.0.0`. pnpm scripts use the locally installed Vite+ CLI; no global installation is required.

- `pnpm run check`: formatting, type-aware lint, type checking, and tests.
- `pnpm run lint` / `pnpm run lint:fix`: Oxlint with Ultracite core, React, and Vitest presets.
- `pnpm run fmt` / `pnpm run fmt:check`: Oxfmt with the Ultracite formatting preset.
- `pnpm test` / `pnpm run test:watch`: Vitest once or in watch mode.
- `pnpm run test:coverage`: V8 coverage with text, HTML, and LCOV reports in `coverage/`; all metrics require 80%.
- `pnpm run check:deploy`: production build and Cloudflare CLI deployment dry run.

Worker configuration lives in `cloudflare.config.ts`; build, lint, formatting, and test configuration lives in `vite.config.ts`. Run `pnpm run cf-typegen` to regenerate Worker types in `.cloudflare/types/`. The Cloudflare CLI and Vite plugin use the beta programmatic configuration. `wrangler.json` is retained for rollback until the first successful deployment with `cf`; development, builds, types, and deployment now use `cloudflare.config.ts`. React tests run in jsdom with Testing Library and automatic cleanup. API tests exercise Hono routing in Node; these are unit tests, not Workers runtime or binding integration tests. Cloudflare plugins are disabled in test mode. Generated Worker types and build output are excluded from linting and formatting.
