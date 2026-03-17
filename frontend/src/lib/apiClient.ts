const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};

async function request<TResponse = void>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Noe gikk galt ved kall til API-et.");
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  return undefined as TResponse;
}

export const apiClient = {
  get: <TResponse>(path: string) => request<TResponse>(path),
  post: <TResponse>(path: string, body?: unknown) =>
    request<TResponse>(path, { method: "POST", body }),
  put: <TResponse>(path: string, body?: unknown) =>
    request<TResponse>(path, { method: "PUT", body }),
  patch: <TResponse>(path: string, body?: unknown) =>
    request<TResponse>(path, { method: "PATCH", body }),
  delete: <TResponse>(path: string) =>
    request<TResponse>(path, { method: "DELETE" }),
};
