import axios from "axios";

const getPrice = async (coinId) => {
  const ids = coinId.join(",");
  const url = "https://api.coingecko.com/api/v3/simple/price";
  const res = await axios.get(url, {
    params: { ids, vs_currencies: "usd" },
    headers: {
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
    },
  });
  return console.log(res.data);
};
export default getPrice;
