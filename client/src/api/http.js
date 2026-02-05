import { API_BASE_URL } from "./config";

const buildUrl = (path) => {
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

export const fetchJson = async (path, options = {}) => {
  const res = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof body === "string" ? body : body?.message;
    throw new Error(message || `Request failed (${res.status})`);
  }

  return body;
};
