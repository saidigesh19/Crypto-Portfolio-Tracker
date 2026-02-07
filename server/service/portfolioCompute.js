import Holding from "../model/Holding.js";
import getPrice from "../Controller/coingecko.js";
import { buildUserPortfolios } from "./portfolioService.js";

const emptyPortfolio = () => ({
  totalCost: 0,
  currentValue: 0,
  totalProfit: 0,
  profitStatus: "profit",
  roi: 0,
  holdings: [],
});

export const computeUserPortfolio = async (userId) => {
  if (!userId) return emptyPortfolio();
  const holdings = await Holding.find({ userId });
  if (!holdings.length) return emptyPortfolio();

  const coinIds = [...new Set(holdings.map((h) => h.coinId).filter(Boolean))];
  if (!coinIds.length) return emptyPortfolio();

  const prices = await getPrice(coinIds);
  if (!prices) return emptyPortfolio();

  const users = buildUserPortfolios(holdings, prices);
  const data = users[userId];
  if (!data) return emptyPortfolio();

  const roi = data.totalCost ? (data.totalProfit / data.totalCost) * 100 : 0;
  return {
    ...data,
    profitStatus: data.totalProfit >= 0 ? "profit" : "loss",
    roi,
  };
};

export const computeAndEmitUser = async (io, userId) => {
  try {
    const data = await computeUserPortfolio(userId);
    if (io && typeof io.to === "function") {
      io.to(userId).emit("portfolioUpdate", {
        totalCost: data.totalCost,
        currentValue: data.currentValue,
        totalProfit: data.totalProfit,
        profitStatus: data.profitStatus,
        roi: data.roi,
        holdings: data.holdings,
      });
    }
    return data;
  } catch (err) {
    console.error("computeAndEmitUser error", err?.message || err);
    return emptyPortfolio();
  }
};
