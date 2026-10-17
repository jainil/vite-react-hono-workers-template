import type { ApiError as ApiErrorBody } from "./generated/client";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly code?: string;
  readonly details?: ApiErrorBody["details"];

  constructor(response: Response, body: unknown) {
    const structured =
      typeof body === "object" && body !== null ? body : undefined;
    super(
      structured &&
        "message" in structured &&
        typeof structured.message === "string"
        ? structured.message
        : `API request failed: ${response.status} ${response.statusText}`
    );
    this.name = "ApiError";
    this.status = response.status;
    this.body = body;
    if (
      structured &&
      "code" in structured &&
      typeof structured.code === "string"
    ) {
      this.code = structured.code;
    }
    if (structured && "details" in structured) {
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Details are retained from the server at the transport boundary.
      this.details = structured.details as ApiErrorBody["details"];
    }
  }
}

/** Shared transport used exclusively by Orval-generated clients. */
export const request = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    let body: unknown = text || undefined;
    try {
      body = JSON.parse(text);
    } catch {
      // Keep non-JSON error responses (including proxy errors) available to callers.
    }
    throw new ApiError(response, body);
  }
  if (response.status === 204 || response.status === 205) {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Orval models bodyless success responses as void.
    return undefined as T;
  }
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- The generated OpenAPI client supplies the response type at this transport boundary.
  return await (response.json() as Promise<T>);
};
