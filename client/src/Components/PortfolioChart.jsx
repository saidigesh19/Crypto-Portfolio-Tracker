import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
);

const palette = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f472b6",
];

const PortfolioChart = ({ points, coinSeries, intervalMinutes = 30 }) => {
  // build timeline from market open (start of local day) to now
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  // choose interval minutes for ticks (default 30 minutes)
  const labels = [];
  for (let t = +start; t <= +now; t += intervalMinutes * 60 * 1000) {
    labels.push(new Date(t));
  }
  // ensure last label is now
  if ((labels.length === 0) || labels[labels.length - 1] < now) labels.push(now);

  // Build datasets: include overall points (if provided) and per-coin series
  const timeLabels = labels.map((d) => d.toLocaleTimeString());
  const datasets = [];

  // coinSeries: { SYMBOL: [{time, value}, ...], ... }
  if (coinSeries) {
    const symbols = Object.keys(coinSeries).sort();
    symbols.forEach((sym, idx) => {
      const parsed = coinSeries[sym]
        .map((p) => ({ time: new Date(p.time), value: Number(p.value) }))
        .sort((a, b) => a.time - b.time);

      // carry-forward values for each label
      const values = labels.map((labelTime) => {
        let last = null;
        for (let i = 0; i < parsed.length; i++) {
          if (parsed[i].time <= labelTime) last = parsed[i];
          else break;
        }
        return last ? last.value : null;
      });

      const finalValues = values.map((v) => (v === null ? 0 : v));

      datasets.push({
        label: sym,
        data: finalValues,
        fill: false,
        borderColor: palette[idx % palette.length],
        backgroundColor: palette[idx % palette.length],
        tension: 0.2,
        pointRadius: 1,
      });
    });
  }

  // fallback: show single series if points provided and no coinSeries
  if (datasets.length === 0 && points) {
    const parsed = points
      .map((p) => ({ time: new Date(p.time), value: Number(p.value) }))
      .sort((a, b) => a.time - b.time);
    const values = labels.map((labelTime) => {
      let last = null;
      for (let i = 0; i < parsed.length; i++) {
        if (parsed[i].time <= labelTime) last = parsed[i];
        else break;
      }
      return last ? last.value : null;
    });
    datasets.push({
      label: "Portfolio",
      data: values.map((v) => (v === null ? 0 : v)),
      fill: false,
      borderColor: "#3b82f6",
      backgroundColor: "#3b82f6",
      tension: 0.2,
    });
  }

  const data = { labels: timeLabels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            const v = context.parsed.y;
            if (v === null || v === undefined) return '';
            return context.dataset.label + ': $' + Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 });
          }
        }
      },
    },
    scales: {
      x: {
        ticks: { maxRotation: 0 },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
          }
        }
      },
    },
  };

  return (
    <div style={{ height: 220 }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default PortfolioChart;
