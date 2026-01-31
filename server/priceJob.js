import Holding from "./model/Holding.js";
import getPrice from "./controller/coingecko.js";

const calculatePrices = async () => {
    const holdings = await Holding.find();
    const coinIds = [...new Set(holdings.map(h => h.coinId))];
    if (!coinIds.length) return;

    const prices = await getPrice(coinIds);
    const users = {};

    holdings.forEach(h => {
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
                holdings: []
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
            profitStatus
        });
    });

    Object.entries(users).forEach(([userId, data]) => {
        data.profitStatus = data.totalProfit >= 0 ? "profit" : "loss";

        const roi = data.totalCost
            ? (data.totalProfit / data.totalCost) * 100
            : 0;

        console.log("=================================");
        console.log(`User: ${userId}`);
        console.log(`Total Cost: $${data.totalCost.toFixed(2)}`);
        console.log(`Current Value: $${data.currentValue.toFixed(2)}`);
        console.log(
            `Total ${data.profitStatus.toUpperCase()}: $${data.totalProfit.toFixed(2)}`
        );
        console.log(`ROI: ${roi.toFixed(2)}%`);
        console.log("Holdings:");

        data.holdings.forEach(h => {
            console.log(
                `  ${h.symbol} | Amount: ${h.amount} | Buy: $${h.buyPrice} | ` +
                `Current: $${h.currentPrice} | Value: $${h.totalValue.toFixed(2)} | ` +
                `${h.profitStatus.toUpperCase()}: $${h.profit.toFixed(2)}`
            );
        });

        console.log("=================================");
    });
};

const startPriceJob = () => {
    // 🔥 run immediately
    calculatePrices();

    // ⏱️ then every 30 seconds
    setInterval(calculatePrices, 30000);
};

export default startPriceJob;
