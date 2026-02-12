import axios from "axios";

// Cache and rate limit settings
const CACHE_TTL_MS = 90_000; // 90s cache window
const RATE_LIMIT_BACKOFF_MS = 180_000; // 3m backoff after a 429
const priceCache = new Map();
let last429At = 0;
let backoffWarned = false;

// Fetches current USD prices for an array of coin IDs from CoinGecko
const getPrice = async (coinIds) => {
  if (!Array.isArray(coinIds) || !coinIds.length) return null;

  // sort to keep cache keys stable regardless of order
  const key = coinIds.map(String).sort().join(",");
  const now = Date.now();

  // Serve from cache if available and not expired
  const cached = priceCache.get(key);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // If we recently hit a 429, back off instead of hammering the API
  if (last429At && now - last429At < RATE_LIMIT_BACKOFF_MS) {
    if (!backoffWarned) {
      console.warn("CoinGecko backoff window active — serving stale data if available.");
      backoffWarned = true;
    }
    return cached?.data || null;
  } else {
    backoffWarned = false;
  }

  try {
    // Call CoinGecko API for price data
    const ids = key;
    const url = "https://api.coingecko.com/api/v3/simple/price";
    const res = await axios.get(url, {
      params: { ids, vs_currencies: "usd" },
      headers: {
        "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
      },
    });

    // Store result in cache
    priceCache.set(key, { data: res.data, timestamp: now });
    return res.data;
  } catch (err) {
    // Handle rate limit and other errors
    const status = err?.response?.status;
    const msg = err?.response?.data?.status?.error_message || err.message;
    if (status === 429) {
      last429At = Date.now();
      backoffWarned = false;
      console.warn("CoinGecko rate limit hit (429) — backing off for 3 minutes.");
    }
    console.error("CoinGecko API error:", status || "-", msg);
    return cached?.data || null;
  }
};

export default getPrice;
