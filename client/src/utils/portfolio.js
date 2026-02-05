export const fetchCoinPrices = async (coinIds = []) => {
  if (!coinIds.length) return {};

  const ids = coinIds.join(",");
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch prices");
  }

  return response.json();
};

export const fetchCoinList = async () => {
  const response = await fetch("https://api.coingecko.com/api/v3/coins/list");
  if (!response.ok) {
    throw new Error("Failed to fetch coin list");
  }
  return response.json();
};

export const buildPortfolio = ({ holdings = [], prices = {} }) => {
  let totalCost = 0;
  let totalValue = 0;
  const updatedHoldings = [];

  holdings.forEach((holding) => {
    const currentPrice = prices[holding.coinId]?.usd || prices[holding.symbol?.toLowerCase()]?.usd || 0;
    const cost = holding.amount * holding.buyPrice;
    const currentValue = holding.amount * currentPrice;
    const profit = currentValue - cost;
    const profitPercent = cost > 0 ? ((profit / cost) * 100).toFixed(2) : 0;

    totalCost += cost;
    totalValue += currentValue;

    updatedHoldings.push({
      ...holding,
      currentPrice,
      totalValue: currentValue,
      profit,
      profitPercent,
      profitStatus: profit >= 0 ? "profit" : "loss",
    });
  });

  const totalProfit = totalValue - totalCost;
  const totalProfitPercent = totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(2) : 0;

  return {
    portfolioData: {
      totalCost: totalCost.toFixed(2),
      totalValue: totalValue.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      totalProfitPercent,
      profitStatus: totalProfit >= 0 ? "profit" : "loss",
    },
    updatedHoldings,
  };
};

export const buildPerCoinPnL = (holdings = []) => {
  const perCoin = {};
  holdings.forEach((h) => {
    const sym = h.symbol?.toUpperCase() || h.coinId || "UNKNOWN";
    const pnl = Number(h.profit) || Number((h.amount * h.currentPrice) - (h.amount * h.buyPrice)) || 0;
    perCoin[sym] = (perCoin[sym] || 0) + pnl;
  });

  return perCoin;
};
