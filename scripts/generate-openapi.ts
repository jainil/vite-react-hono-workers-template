import { mkdir, writeFile } from "node:fs/promises";

import { generateSpecs } from "hono-openapi";

import { app } from "../src/worker/app.ts";
import { openapiOptions } from "../src/worker/openapi.ts";

const spec = await generateSpecs(app, openapiOptions);
await mkdir("openapi", { recursive: true });
await writeFile("openapi/openapi.json", `${JSON.stringify(spec, null, 2)}\n`);
