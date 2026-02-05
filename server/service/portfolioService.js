export const buildUserPortfolios = (holdings, prices) => {
  const users = {};

  holdings.forEach((h) => {
    const currentPrice = prices[h.coinId]?.usd || 0;
    const cost = h.amount * h.buyPrice;
    const currentValue = h.amount * currentPrice;
    const profit = currentValue - cost;
    const profitStatus = profit >= 0 ? "profit" : "loss";

    if (!users[h.userId]) {
      users[h.userId] = {
        totalCost: 0,
        currentValue: 0,
        totalProfit: 0,
        profitStatus: "profit",
        holdings: [],
      };
    }

    users[h.userId].totalCost += cost;
    users[h.userId].currentValue += currentValue;
    users[h.userId].totalProfit += profit;

    users[h.userId].holdings.push({
      symbol: h.symbol,
      amount: h.amount,
      buyPrice: h.buyPrice,
      currentPrice,
      totalValue: currentValue,
      profit,
      profitStatus,
    });
  });

  return users;
};
