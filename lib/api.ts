import { CONFIG } from "@/lib/config";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type ApiInit = Omit<RequestInit, "body"> & {
  body?: any;
  query?: Record<string, string | number | boolean | null | undefined>;
  timeoutMs?: number;
  useAuthToken?: boolean;
};

const AUTH_TOKEN_KEYS = [
  "moveready_access_token",
  "moveready_session_token",
  "relocation_access_token",
  "auth_token",
  "access_token",
];

const ACCOUNT_WRITE_PREFIXES = [
  "profiles",
  "saved-routes",
  "watchlist/subscriptions",
  "timeline",
  "platform/service-interest",
];

function isPlainObject(v: any) {
  if (v === null || typeof v !== "object") return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

function cleanApiPath(path: string) {
  let cleanPath = path.startsWith("/") ? path.slice(1) : path;
  if (cleanPath.startsWith("api/")) cleanPath = cleanPath.slice(4);
  return cleanPath.replace(/^\/+/, "");
}

function shouldAttachAccountToken(path: string, method: string) {
  if (method === "GET" || method === "HEAD") return false;
  const cleanPath = cleanApiPath(path).replace(/\/$/, "");
  return ACCOUNT_WRITE_PREFIXES.some((prefix) => cleanPath === prefix || cleanPath.startsWith(`${prefix}/`));
}

function safeGetLocalToken(): string | null {
  try {
    if (typeof window === "undefined") return null;
    for (const key of AUTH_TOKEN_KEYS) {
      const value = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (value && value.trim() && value !== "undefined" && value !== "null") {
        return value.trim();
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function clearStoredAuthToken() {
  try {
    if (typeof window === "undefined") return;
    AUTH_TOKEN_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  } catch {
    // ignore storage failures
  }
}

function buildUrl(path: string, query?: ApiInit["query"]) {
  const cleanPath = cleanApiPath(path);
  const base = CONFIG.apiBase.replace(/\/$/, "");
  const url = `${base}/api/${cleanPath}`;

  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

export async function apiJson<T = any>(path: string, init: ApiInit = {}, token?: string | null): Promise<T> {
  const method = (init.method || "GET").toUpperCase();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.headers as Record<string, string>),
  };

  const forceAccountToken = shouldAttachAccountToken(path, method);
  const effectiveToken = init.useAuthToken === false && !forceAccountToken ? null : (token || safeGetLocalToken());
  if (effectiveToken) headers.Authorization = `Bearer ${effectiveToken}`;

  let bodyToSend: BodyInit | undefined;
  if (init.body !== undefined) {
    const body = init.body;
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    if (typeof body === "string") {
      bodyToSend = body;
      headers["Content-Type"] ||= "application/json";
    } else if (isFormData) {
      bodyToSend = body as BodyInit;
    } else if (isPlainObject(body) || Array.isArray(body)) {
      bodyToSend = JSON.stringify(body);
      headers["Content-Type"] ||= "application/json";
    } else {
      bodyToSend = JSON.stringify(body);
      headers["Content-Type"] ||= "application/json";
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), init.timeoutMs || 30000);

  try {
    const response = await fetch(buildUrl(path, init.query), {
      ...init,
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : bodyToSend,
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
      const message = isPlainObject(data) && data.error ? String(data.error) : `Request failed with status ${response.status}`;
      throw new ApiError(response.status, message, data);
    }

    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}
