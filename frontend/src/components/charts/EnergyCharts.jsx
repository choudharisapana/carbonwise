// frontend/src/components/charts/EnergyChart.jsx

import React from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const EnergyChart = ({ data }) => {

  // =========================================================
  // Chart Data
  // =========================================================

  const chartData = data
    ? {
        ...data,

        datasets: data.datasets.map((dataset) => ({
          ...dataset,

          // CarbonWise professional palette
          backgroundColor: [
            "#10B981", // CI/CD Compute - Emerald
            "#8B5CF6", // Repository Storage - Purple
            "#06B6D4", // Dependencies / Network - Cyan
          ],

          // Dark separator between segments
          borderColor: "#111827",

          borderWidth: 3,

          hoverBorderColor: "#1E293B",

          hoverOffset: 8,
        })),
      }
    : {
        labels: [],
        datasets: [],
      };

  // =========================================================
  // Check Whether Real Data Exists
  // =========================================================

  const hasData =
    chartData.datasets?.length > 0 &&
    chartData.datasets.some(
      (dataset) =>
        dataset.data &&
        dataset.data.some(
          (value) => Number(value) > 0
        )
    );

  // =========================================================
  // Chart Options
  // =========================================================

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: "68%",

    animation: {
      duration: 700,
      easing: "easeOutQuart",
    },

    plugins: {

      // -----------------------------------------------------
      // Legend
      // -----------------------------------------------------

      legend: {
        position: "bottom",

        align: "center",

        labels: {

          color: "#CBD5E1",

          font: {
            family: "Poppins",
            size: 11,
            weight: "500",
          },

          padding: 16,

          usePointStyle: true,

          pointStyle: "circle",

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

          label: (context) => {

            const value = Number(
              context.raw || 0
            );

            // kWh -> Wh
            const valueWh = value * 1000;

            return ` ${context.label}: ${valueWh.toFixed(
              2
            )} Wh`;
          },

        },
      },
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
        flex
        items-center
        justify-center
      "
    >

      {hasData ? (

        <Doughnut
          data={chartData}
          options={options}
        />

      ) : (

        // ---------------------------------------------------
        // Empty State
        // ---------------------------------------------------

        <div
          className="
            text-center
            px-4
            max-w-sm
          "
        >

          <div
            className="
              w-12
              h-12
              mx-auto
              mb-4
              rounded-xl
              bg-cyan-500/10
              border
              border-cyan-500/20
              flex
              items-center
              justify-center
            "
          >

            <span className="text-cyan-400 text-xl">
              ⚡
            </span>

          </div>

          <p
            className="
              text-gray-300
              text-sm
              font-medium
            "
          >
            No energy data yet
          </p>

          <p
            className="
              text-gray-500
              text-xs
              mt-2
              leading-5
            "
          >
            Analyze your repositories to see
            how estimated energy consumption
            is distributed.
          </p>

        </div>

      )}

    </div>
  );
};

export default EnergyChart;