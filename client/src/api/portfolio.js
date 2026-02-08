import { fetchJson } from "./http";

export async function getPortfolio(userId) {
  return await fetchJson(`/api/portfolio/${userId}`);
}
