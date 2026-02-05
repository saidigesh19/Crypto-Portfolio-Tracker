import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Plugins below add percentage labels on slices and a centered total label.
const percentLabelPlugin = {
  id: 'percentLabelPlugin',
  afterDraw: (chart) => {
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    if (!dataset) return;
    const data = dataset.data || [];
    const total = data.reduce((a, b) => a + b, 0) || 0;

    const meta = chart.getDatasetMeta(0);
    meta.data.forEach((arc, i) => {
      const value = data[i] || 0;
      const pct = total ? ((value / total) * 100).toFixed(1) + '%' : '';
      // try to get center point for arc
      let x, y;
      if (typeof arc.getCenterPoint === 'function') {
        const pt = arc.getCenterPoint();
        x = pt.x; y = pt.y;
      } else {
        // fallback: use chart center
        const box = chart.chartArea;
        x = (box.left + box.right) / 2;
        y = (box.top + box.bottom) / 2;
      }

      ctx.save();
      ctx.fillStyle = 'rgba(230,238,248,0.95)';
      ctx.font = '600 11px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pct, x, y);
      ctx.restore();
    });
  }
};

const centerTextPlugin = {
  id: 'centerTextPlugin',
  beforeDraw: (chart) => {
    const dataset = chart.data.datasets[0];
    const data = dataset ? (dataset.data || []) : [];
    const total = data.reduce((a, b) => a + b, 0) || 0;
    const { ctx } = chart;
    const box = chart.chartArea;
    const x = (box.left + box.right) / 2;
    const y = (box.top + box.bottom) / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(230,238,248,0.95)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 14px Inter, Arial, sans-serif';
    ctx.fillText('$' + Number(total).toLocaleString(undefined, { maximumFractionDigits: 2 }), x, y - 8);
    ctx.font = '400 11px Inter, Arial, sans-serif';
    ctx.fillText('Total Value', x, y + 12);
    ctx.restore();
  }
};

ChartJS.register(ArcElement, Tooltip, Legend, percentLabelPlugin, centerTextPlugin);

const palette = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f472b6'
];

const DistributionChart = ({ holdings = [] }) => {
  // aggregate totalValue by symbol
  const map = {};
  holdings.forEach((h) => {
    const sym = (h.symbol || h.coinId || 'UNKNOWN').toUpperCase();
    const val = Number(h.totalValue || (h.amount && h.currentPrice ? h.amount * h.currentPrice : 0)) || 0;
    map[sym] = (map[sym] || 0) + val;
  });

  const labels = Object.keys(map);
  const dataValues = labels.map((l) => map[l]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Distribution',
        data: dataValues,
        backgroundColor: labels.map((_, i) => palette[i % palette.length]),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text') || '#e6eef8',
          boxWidth: 12,
          padding: 12,
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const val = context.raw || 0;
            const total = dataValues.reduce((a, b) => a + b, 0) || 1;
            const pct = ((val / total) * 100).toFixed(2);
            return `${context.label}: ${pct}% (${Number(val).toLocaleString(undefined, { maximumFractionDigits: 2 })})`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: 220 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DistributionChart;
