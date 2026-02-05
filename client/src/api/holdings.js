import { fetchJson } from "./http";

export const getHoldings = async (userId) => {
  return fetchJson(`/api/holdings/${userId}`);
};

export const addHolding = async (payload) => {
  return fetchJson("/api/holdings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateHolding = async (id, payload) => {
  return fetchJson(`/api/holdings/${id}` , {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteHolding = async (id) => {
  return fetchJson(`/api/holdings/${id}`, {
    method: "DELETE",
  });
};
