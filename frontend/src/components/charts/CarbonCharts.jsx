// frontend/src/components/charts/CarbonCharts.jsx

import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const CarbonChart = ({ data }) => {
  // =========================================================
  // Chart Data
  // =========================================================

  const chartData = data
    ? {
        ...data,

        datasets: data.datasets.map((dataset) => ({
          ...dataset,

          // Professional CarbonWise palette
          backgroundColor: [
            "#10B981", // Emerald
            "#06B6D4", // Cyan
            "#8B5CF6", // Purple
            "#F59E0B", // Amber
            "#3B82F6", // Blue
            "#EC4899", // Pink
          ],

          borderColor: [
            "#10B981",
            "#06B6D4",
            "#8B5CF6",
            "#F59E0B",
            "#3B82F6",
            "#EC4899",
          ],

          borderWidth: 1,

          borderRadius: 7,

          borderSkipped: false,

          barPercentage: 0.65,

          categoryPercentage: 0.7,
        })),
      }
    : {
        labels: [],
        datasets: [],
      };

  // =========================================================
  // Check Data
  // =========================================================

  const hasData =
    chartData.labels?.length > 0 &&
    chartData.datasets?.length > 0 &&
    chartData.datasets.some(
      (dataset) =>
        dataset.data &&
        dataset.data.length > 0
    );

  // =========================================================
  // Chart Options
  // =========================================================

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      // -----------------------------------------------------
      // Legend
      // -----------------------------------------------------

      legend: {
        display: true,

        position: "top",

        align: "end",

        labels: {
          color: "#CBD5E1",

          font: {
            family: "Poppins",
            size: 11,
            weight: "500",
          },

          usePointStyle: true,

          pointStyle: "rectRounded",

          padding: 16,

          boxWidth: 8,

          boxHeight: 8,
        },
      },

      // -----------------------------------------------------
      // Tooltip
      // -----------------------------------------------------

      tooltip: {
        enabled: true,

        backgroundColor: "#0F172A",

        borderColor: "#334155",

        borderWidth: 1,

        titleColor: "#FFFFFF",

        bodyColor: "#CBD5E1",

        cornerRadius: 10,

        padding: 12,

        displayColors: true,

        titleFont: {
          family: "Poppins",
          size: 12,
          weight: "600",
        },

        bodyFont: {
          family: "Poppins",
          size: 11,
        },

        callbacks: {
          title: (items) => {
            return items.length
              ? items[0].label
              : "";
          },

          label: (context) => {
            const value = Number(
              context.raw || 0
            );

            return ` CO₂ Emission: ${value.toFixed(
              2
            )} gCO₂e`;
          },
        },
      },
    },

    // =======================================================
    // Scales
    // =======================================================

    scales: {
      // -----------------------------------------------------
      // X Axis
      // -----------------------------------------------------

      x: {
        grid: {
          display: false,
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#CBD5E1",

          font: {
            family: "Poppins",
            size: 10,
            weight: "500",
          },

          maxRotation: 0,

          minRotation: 0,

          autoSkip: true,

          maxTicksLimit: 6,

          padding: 8,
        },
      },

      // -----------------------------------------------------
      // Y Axis
      // -----------------------------------------------------

      y: {
        beginAtZero: true,

        border: {
          display: false,
        },

        grid: {
          color:
            "rgba(148, 163, 184, 0.08)",

          drawBorder: false,

          lineWidth: 1,
        },

        ticks: {
          color: "#94A3B8",

          font: {
            family: "Poppins",
            size: 10,
          },

          padding: 8,

          callback: (value) => {
            return `${value} g`;
          },
        },

        title: {
          display: true,

          text: "CO₂ Emission (gCO₂e)",

          color: "#64748B",

          font: {
            family: "Poppins",
            size: 10,
            weight: "500",
          },

          padding: {
            bottom: 8,
          },
        },
      },
    },

    // =======================================================
    // Animation
    // =======================================================

    animation: {
      duration: 700,

      easing: "easeOutQuart",
    },
  };

  // =========================================================
  // Component
  // =========================================================

  return (
    <div
      className="
        w-full
        h-[260px]
        sm:h-[300px]
        md:h-[320px]
        lg:h-[340px]
      "
    >
      {hasData ? (
        <Bar
          data={chartData}
          options={options}
        />
      ) : (
        // ---------------------------------------------------
        // Empty State
        // ---------------------------------------------------

        <div
          className="
            h-full
            flex
            items-center
            justify-center
            text-center
            px-4
          "
        >
          <div className="max-w-sm">
            <div
              className="
                w-12
                h-12
                mx-auto
                mb-4
                rounded-xl
                bg-emerald-500/10
                border
                border-emerald-500/20
                flex
                items-center
                justify-center
              "
            >
              <span className="text-emerald-400 text-xl">
                CO₂
              </span>
            </div>

            <p
              className="
                text-gray-300
                text-sm
                font-medium
              "
            >
              No repository analysis data yet
            </p>

            <p
              className="
                text-gray-500
                text-xs
                mt-2
                leading-5
              "
            >
              Analyze your GitHub repositories
              to compare their estimated
              carbon impact.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarbonChart;