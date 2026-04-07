function getPublicApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000";
}

function getInternalApiBaseUrl(): string | undefined {
  const value = process.env.API_URL_INTERNAL?.trim();
  return value ? value : undefined;
}

export function getApiBaseUrl(): string {
  // Browser requests must use a host-reachable URL (ex: http://localhost:5000).
  // Server-side rendering inside Docker must use the service hostname (ex: http://backend:8080).
  const publicBaseUrl = getPublicApiBaseUrl();
  if (typeof window === "undefined") {
    return getInternalApiBaseUrl() ?? publicBaseUrl;
  }
  return publicBaseUrl;
}

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

function getSupabaseSessionToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const allKeys = Object.keys(window.localStorage);
    
    // Find Supabase auth token dynamically (keys start with "sb-" and end with "-auth-token")
    for (const key of allKeys) {
      if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
        const authItem = window.localStorage.getItem(key);
        if (authItem) {
          const session = JSON.parse(authItem) as { access_token?: string };
          return session.access_token;
        }
      }
    }
    
    // Fallback: check for auth.session key (used by some Supabase configurations)
    const sessionKey = allKeys.find(k => k.includes("auth") && k.includes("session"));
    if (sessionKey) {
      const sessionItem = window.localStorage.getItem(sessionKey);
      if (sessionItem) {
        const session = JSON.parse(sessionItem) as { access_token?: string };
        if (session.access_token) {
          return session.access_token;
        }
      }
    }
    
    return undefined;
  } catch (error) {
    return undefined;
  }
}

async function request<TResponse = void>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  console.log("📡 API Request:", { path, method: options.method ?? "GET" });
  
  const requestUrl = `${getApiBaseUrl()}${path}`;

  const token = getSupabaseSessionToken();
  
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(requestUrl, {
      method: options.method ?? "GET",
      headers,
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
          const parsed = JSON.parse(message) as {
            title?: string;
            detail?: string;
          };
          const details = [parsed.title, parsed.detail]
            .filter(Boolean)
            .join(" - ");
          if (details) {
            message = details;
          }
        } catch {
          // Response body may be plain text; keep original message in that case.
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
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    
    // Enhanced error logging for network errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Network error fetching ${path}:`, {
      url: requestUrl,
      method: options.method ?? "GET",
      error: errorMessage,
      hasToken: !!token,
    });
    
    throw new Error(`Network error: ${errorMessage}. Details: Kunne ikke koble til API på ${getApiBaseUrl()}`);
  }
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
