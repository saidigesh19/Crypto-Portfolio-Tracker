import Holding from "./model/Holding.js";
import getPrice from "./Controller/coingecko.js";
import { buildUserPortfolios } from "./service/portfolioService.js";

const calculatePrices = async (io) => {
    try {
        const holdings = await Holding.find();
        const coinIds = [...new Set(holdings.map(h => h.coinId))];
        if (!coinIds.length) return;

        const prices = await getPrice(coinIds);

        if (!prices) {
            console.warn("Price fetch failed or rate limited — skipping this cycle.");
            return;
        }

        const users = buildUserPortfolios(holdings, prices);

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

            // emit to user's room if io provided
            if (io && typeof io.to === 'function') {
                io.to(userId).emit('portfolioUpdate', {
                    totalCost: data.totalCost,
                    currentValue: data.currentValue,
                    totalProfit: data.totalProfit,
                    profitStatus: data.profitStatus,
                    roi,
                    holdings: data.holdings
                });
            }
        });
    } catch (err) {
        console.error('Error in calculatePrices:', err.message || err);
    }
};

const startPriceJob = (io) => {
    // 🔥 run immediately
    calculatePrices(io);

    // ⏱️ then every 30 seconds
    setInterval(() => calculatePrices(io), 30000);
};

export default startPriceJob;
