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
  "saved-route-reports",
  "watchlist/subscriptions",
  "timeline",
  "platform/service-interest",
  "relocation/reports",
  "journey",
  "readiness",
  "education",
  "travel",
  "billing",
];

function isPlainObject(v: any) {
  if (v === null || typeof v !== "object") return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

function apiErrorMessage(data: any, status: number) {
  const fallback = `Request failed with status ${status}`;

  if (typeof data === "string") {
    return data.trim() || fallback;
  }

  if (!isPlainObject(data)) return fallback;

  const candidates = [data.message, data.error, data.detail];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }

    if (isPlainObject(candidate)) {
      const nestedCandidates = [
        candidate.message,
        candidate.error,
        candidate.detail,
        candidate.code,
      ];
      const nestedMessage = nestedCandidates.find(
        (value) => typeof value === "string" && value.trim(),
      );
      if (typeof nestedMessage === "string") return nestedMessage.trim();
    }
  }

  return fallback;
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
    // Ignore storage failures.
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

function countryList(value: any): string[] {
  const values = Array.isArray(value) ? value : String(value || "").split(",");
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of values) {
    const cleaned = String(item || "").trim();
    const key = cleaned.toLocaleLowerCase();
    if (cleaned && !seen.has(key)) {
      seen.add(key);
      result.push(cleaned);
    }
    if (result.length >= 30) break;
  }
  return result;
}

function searchContractFromProfile(profile: any) {
  const rawScope = String(profile?.search_scope || "international").trim().toLowerCase();
  const searchScope = ["local", "international", "both"].includes(rawScope) ? rawScope : "international";
  const currentCountry = String(profile?.current_country || "").trim() || null;
  const primaryCountry = String(profile?.primary_country || "").trim() || null;
  const currentKey = String(currentCountry || "").toLowerCase();
  const internationalTargets = countryList([primaryCountry, ...countryList(profile?.later_countries)])
    .filter((country) => country.toLowerCase() !== currentKey);
  const localTargets = countryList([currentCountry]);
  const targetCountries = searchScope === "local"
    ? localTargets
    : searchScope === "international"
      ? internationalTargets
      : countryList([currentCountry, ...internationalTargets]);
  const missingFields: string[] = [];
  if (!currentCountry) missingFields.push("current_country");
  if (["international", "both"].includes(searchScope) && !internationalTargets.length) {
    missingFields.push("international_target_country");
  }
  return {
    version: "b05-v1",
    ready: missingFields.length === 0,
    search_scope: searchScope,
    current_country: currentCountry,
    local_target_countries: localTargets,
    international_target_countries: internationalTargets,
    target_countries: targetCountries,
    work_authorized_countries: countryList(profile?.work_authorized_countries),
    missing_fields: missingFields,
    truth_note: "Work authorization is user-reported and vacancy sponsorship is source-derived; neither is a guarantee of employment or immigration approval.",
  };
}

function normalizeApiResponse(path: string, data: any) {
  const cleanPath = cleanApiPath(path).replace(/\/$/, "");
  if (cleanPath === "jobs/automation/overview" && isPlainObject(data) && data.profile) {
    const contract = isPlainObject(data.search_contract) ? data.search_contract : searchContractFromProfile(data.profile);
    return { ...data, search_contract: contract };
  }
  return data;
}

export async function apiJson<T = any>(path: string, init: ApiInit = {}, token?: string | null): Promise<T> {
  const method = (init.method || "GET").toUpperCase();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.headers as Record<string, string>),
  };

  // Account-owned writes always receive the locally stored session token when
  // available. This protects verified ownership even when a public planner can
  // also run anonymously.
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
      const message = apiErrorMessage(data, response.status);
      throw new ApiError(response.status, message, data);
    }

    return normalizeApiResponse(path, data) as T;
  } finally {
    clearTimeout(timeout);
  }
}
