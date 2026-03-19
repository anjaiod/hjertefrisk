const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiClientError extends Error {
  status: number;
  statusText: string;
  path: string;
  responseBody: string;

  constructor(
    message: string,
    details: {
      status: number;
      statusText: string;
      path: string;
      responseBody: string;
    },
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = details.status;
    this.statusText = details.statusText;
    this.path = details.path;
    this.responseBody = details.responseBody;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};

async function request<TResponse = void>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const requestUrl = `${apiBaseUrl}${path}`;

  const response = await fetch(requestUrl, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const body = await response.text();
    const fallbackMessage = `API-feil ${response.status} (${response.statusText}) for ${path}`;

    let message = body.trim();
    if (!message) {
      message = fallbackMessage;
    } else {
      try {
        const parsed = JSON.parse(message) as { title?: string; detail?: string };
        const details = [parsed.title, parsed.detail].filter(Boolean).join(" - ");
        if (details) {
          message = details;
        }
      } catch {
      }
    }

    throw new ApiClientError(message, {
      status: response.status,
      statusText: response.statusText,
      path,
      responseBody: body,
    });
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
