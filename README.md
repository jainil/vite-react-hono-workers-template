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

## Folder structure

The frontend and Worker use feature-first organization. Only folders needed by the starter are created; the growth examples below are conventions, not empty scaffolding.

```text
src/
├── react-app/
│   ├── main.tsx                         # React bootstrap and global styles
│   ├── app.tsx                          # Application composition
│   ├── app/
│   │   ├── routes.tsx                   # Top-level Wouter routes and fallback
│   │   └── routes.test.tsx              # Routing and not-found behavior
│   ├── features/
│   │   └── home/
│   │       └── pages/
│   │           ├── home-page.tsx        # Existing starter screen
│   │           ├── home-page.css
│   │           └── home-page.test.tsx    # Home screen behavior and API interaction
│   ├── assets/
│   ├── styles/
│   │   └── globals.css
│   ├── test/
│   │   └── setup.ts
│   └── vite-env.d.ts
└── worker/
    ├── index.ts                         # Worker entry point
    ├── app.ts                           # Hono setup and route composition
    ├── types.ts                         # Hono environment using generated Env
    ├── features/
    │   └── greeting/
    │       ├── routes.ts                # Existing GET /api/ endpoint
    │       └── routes.test.ts           # Greeting endpoint response
    └── app.test.ts                      # Application-wide API fallback tests
```

### React application conventions

Each product area owns its pages, components, data access, and state. A larger feature can grow into:

```text
features/projects/
├── routes.tsx                           # Routes within /projects
├── pages/
│   ├── projects-page.tsx
│   ├── project-detail-page.tsx
│   └── project-settings-page.tsx
├── components/
│   ├── project-form.tsx
│   ├── project-form.test.tsx
│   └── project-form.module.css
├── api/
│   ├── queries.ts
│   └── mutations.ts
├── hooks/
├── schemas.ts
├── types.ts
└── utils.ts
```

- Keep pages thin: compose the screen, read route parameters, and call feature hooks.
- Keep feature code local. Promote reusable code into `react-app/shared/` when multiple features need it: `ui/` for buttons, inputs, dialogs, and tables; `components/` for shared compositions such as empty states; `hooks/` for domain-independent hooks; `lib/` for an API client and utilities; and `types/` for shared frontend types.
- Keep dependencies flowing from `app` to `features` to `shared`. Shared frontend code must not import features. Avoid reaching into another feature's internal files; expose a deliberate public API when necessary.
- Add `app/providers.tsx` for application-wide providers, `app/layouts/` for app and authentication shells, `app/guards/` for navigation guards, and `app/paths.ts` for shared URL builders when needed. Client guards do not replace API authorization.
- Keep URL state such as filters and pagination in the URL, transient UI state local, and server data in SWR through generated hooks. Add shared client state only for state that actually spans features.
- Colocate component tests and styles. Keep global styles and design tokens in `styles/`. Add `test/render.tsx` when tests need a common provider wrapper.
- Lazy-load substantial pages or features with React lazy loading and Suspense; place loading and error boundaries around the relevant route content.

Wouter routing is explicit; directory names do not generate routes. The starter registers `/` and a final not-found route. Keep top-level composition in `app/routes.tsx`, then give larger features their own `routes.tsx`. Use a parent `Route` with `nest` to scope child paths:

```tsx
<Route path="/projects" nest>
  <AppLayout>
    <ProjectRoutes />
  </AppLayout>
</Route>
```

Inside `ProjectRoutes`, use a `Switch` with `/`, `/:projectId/settings`, `/:projectId`, and a final fallback. These match beneath `/projects`; each nested switch needs its own fallback. Links and locations are scoped inside nested routes; use `~/` to navigate from the application root. See the [Wouter documentation](https://github.com/molefrog/wouter#route-nesting).

### Worker conventions

Group backend code by domain and compose feature routers with Hono's `app.route()`. The starter keeps the existing greeting handler in one route module. Add layers only when a feature needs them:

| File | Responsibility |
| --- | --- |
| `routes.ts` | Parse and validate requests, enforce access, call services, return HTTP responses |
| `routes.test.ts` | Exercise endpoint behavior |
| `service.ts` | Business rules, authorization rules, and multi-step operations |
| `service.test.ts` | Verify business behavior |
| `repository.ts` | Database queries and persistence |
| `schemas.ts` | Runtime request validation |
| `types.ts` | Feature-specific types |

- Keep simple handlers in `routes.ts`. Extract services when business logic grows and repositories when persistence needs separation.
- Keep Hono `Context` in the HTTP layer. Pass ordinary values and explicit dependencies or bindings into services rather than passing the entire request context.
- Keep route handlers beside their route definitions to preserve parameter inference. Chain route registration and `app.route()` calls to retain the exported `AppType` for backend route typing. See [Hono best practices](https://hono.dev/docs/guides/best-practices) and [Hono RPC](https://hono.dev/docs/guides/rpc).
- Add `worker/middleware/` for shared authentication, request IDs, and error handling; `worker/integrations/` for external clients such as email and payments; and `worker/lib/` for shared errors and logging. Feature-specific helpers stay in their feature.
- Keep `index.ts` as the runtime entry point and `app.ts` as HTTP application composition. Add scheduled handlers, queue consumers, Durable Objects, or Workflows only when those capabilities exist, consulting the current Cloudflare documentation first.
- Reuse the generated `Env` through `worker/types.ts`; do not duplicate binding declarations. Update `cloudflare.config.ts` and run `pnpm run cf-typegen` when adding bindings.
- Match frontend and backend feature names where useful, while allowing their responsibilities to evolve independently.

### API contracts and data fetching

All frontend API data fetching uses this pipeline:

1. Define Zod request and response schemas in `worker/features/<feature>/schemas.ts`.
2. Register routes with `hono-openapi`: `validator as zValidator` from `hono-openapi` validates and documents Zod request schemas; handlers consume parsed input with `c.req.valid()`; `describeRoute` supplies a stable `operationId`, and `resolver` documents Zod response schemas. Parse response bodies with those schemas before returning typed JSON. Document each status and response body.
3. Run `pnpm run api:generate` to export `openapi/openapi.json` from the Hono app and generate the typed SWR client at `src/react-app/shared/api/generated/client.ts` with Orval.
4. Import generated SWR query and mutation hooks into frontend features. Keep server state in SWR; feature wrappers may compose generated hooks.

The live contract is available at `/api/openapi.json`. Generation needs no running server or Cloudflare credentials. Development, builds, and checks regenerate the client automatically; rerun generation after editing routes during development. Commit the specification and generated client together, and never edit generated files manually. Generated code is type-checked but excluded from lint, formatting, and coverage.

The greeting endpoint validates an optional `name` query parameter (trimmed, 1–100 characters) and returns HTTP 400 for invalid values. Without it, the response remains `{ "name": "Durable" }`. This follows the [Hono OpenAPI Zod guide](https://honohub.dev/docs/openapi/zod), including `resolver` for response documentation and Zod `.parse()` for runtime response validation and automatic validation-error documentation.

The greeting page demonstrates `useGetGreeting` with conditional fetching until the button is clicked, SWR caching, and error handling. Use this workflow for new reads and writes; do not add handwritten fetch calls, separate Axios clients, Hono RPC clients, or duplicate frontend DTOs. Browser-safe schemas shared for other purposes may live in `src/shared/schemas/`; Worker bindings and secrets must stay in backend code.

### Test file locations

Colocate tests beside the module or feature they exercise, using `*.test.ts` or `*.test.tsx`:

| Location | Coverage |
| --- | --- |
| `src/react-app/features/home/pages/home-page.test.tsx` | Counter interactions, API responses, network and HTTP failures |
| `src/react-app/app/routes.test.tsx` | Application routing and the not-found fallback |
| `src/react-app/test/setup.ts` | Shared jsdom setup and Testing Library cleanup; not a test suite |
| `src/worker/features/greeting/routes.test.ts` | Greeting response at `/api/` through the composed Hono app |
| `src/worker/app.test.ts` | Application-wide unknown-route fallback |

As features grow, put isolated endpoint tests in `worker/features/<feature>/routes.test.ts`, business-rule tests beside `service.ts`, and React component tests beside their components. Keep tests that verify application-wide route composition beside `app.ts` or `app/routes.tsx`. Shared fixtures and render helpers belong in each application's `test/` directory when needed.

Vite+ discovers tests recursively under `src/react-app/` and `src/worker/`, so colocated suites need no configuration changes. Frontend suites run in jsdom; Worker suites run in Node and do not verify Cloudflare bindings or runtime behavior. Run all suites with `pnpm test` or collect coverage with `pnpm run test:coverage`.

### Browser smoke test

Install Chromium once, then run the single Playwright smoke test:

```bash
pnpm exec playwright install chromium
pnpm run test:smoke
```

On Linux CI, use `pnpm exec playwright install --with-deps chromium` to install browser system dependencies too.

The test in `e2e/smoke.test.ts` builds through `pnpm run preview` and starts the built application in the local Workers runtime on `127.0.0.1:4173`. It verifies the rendered home page, the API button's real JSON response and updated label, a direct unknown frontend navigation (HTTP 200 with the React not-found page), and an unknown API navigation (HTTP 404 with the JSON error). It also fails on uncaught browser errors. No API responses are mocked. This checks local production output and asset routing; it does not contact a deployed Cloudflare environment.

Playwright manages server startup and shutdown and refuses to reuse an existing server, ensuring a development server or stale build cannot satisfy the test. Port 4173 must be free. Failure traces are saved under the ignored `test-results/` directory. The browser smoke test runs separately from the fast Node/jsdom suites.

The asset configuration sends `/api` and `/api/*` to the Worker first so browser navigations receive API responses instead of the SPA shell. Other frontend navigations retain the SPA fallback. See Cloudflare's [SPA routing documentation](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/#advanced-routing-control).

### Structure decisions

Feature ownership was chosen over global `pages/`, `hooks/`, `controllers/`, `services/`, and `repositories/` folders, which scatter related code across the application. Extra architecture layers, placeholder providers, authentication, persistence, and example product features are deferred until needed. The current starter behavior is retained, with Wouter providing explicit frontend routing. No additional clarification questions were needed.

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
