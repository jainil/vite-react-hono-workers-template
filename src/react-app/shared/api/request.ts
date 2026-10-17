/** Shared transport used exclusively by Orval-generated clients. */
export const request = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
  if (response.status === 204 || response.status === 205) {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Orval models bodyless success responses as void.
    return undefined as T;
  }
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- The generated OpenAPI client supplies the response type at this transport boundary.
  return await (response.json() as Promise<T>);
};
