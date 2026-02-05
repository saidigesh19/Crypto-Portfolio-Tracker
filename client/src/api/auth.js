import { fetchJson } from "./http";

export const login = async ({ email, password }) => {
  return fetchJson("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const signup = async ({ name, email, password }) => {
  return fetchJson("/api/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};
