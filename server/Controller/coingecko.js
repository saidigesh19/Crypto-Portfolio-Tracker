import axios from "axios";

const getPrice = async (coinIds) => {
  try {
    const ids = coinIds.join(",");
    const url = "https://api.coingecko.com/api/v3/simple/price";
    const res = await axios.get(url, {
      params: { ids, vs_currencies: "usd" },
      headers: {
        "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
      },
    });
    return res.data;
  } catch (err) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.status?.error_message || err.message;
    console.error("CoinGecko API error:", status || "-", msg);
    return null;
  }
};

export default getPrice;
