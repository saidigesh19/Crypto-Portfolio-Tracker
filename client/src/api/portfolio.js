// client/src/api/portfolio.js
// Basic placeholder for getPortfolio. Update the URL to match your backend API.

import { fetchJson } from "./http";

export async function getPortfolio(userId) {
  // Replace the URL with your actual backend endpoint
  return await fetchJson(`/api/portfolio/${userId}`);
}
