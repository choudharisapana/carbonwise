// frontend/src/components/analysis/AnalysisMetrics.jsx

import React, { useContext } from "react";
import {
  FaLeaf,
  FaBolt,
  FaAward,
  FaCloud
} from "react-icons/fa";

import Card from "../common/Card";
import { ThemeContext } from "../../context/ThemeContext";

const AnalysisMetrics = ({ metrics }) => {
  const { formatCarbon } = useContext(ThemeContext);
  if (!metrics) return null;

  // =========================================
  // Grade
  // =========================================

  const getGrade = (score) => {
    if (score >= 90) {
      return {
        letter: "A",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10"
      };
    }

    if (score >= 75) {
      return {
        letter: "B",
        color: "text-cyan-400",
        bg: "bg-cyan-500/10"
      };
    }

    if (score >= 60) {
      return {
        letter: "C",
        color: "text-amber-400",
        bg: "bg-amber-500/10"
      };
    }

    if (score >= 40) {
      return {
        letter: "D",
        color: "text-orange-400",
        bg: "bg-orange-500/10"
      };
    }

    return {
      letter: "F",
      color: "text-red-400",
      bg: "bg-red-500/10"
    };
  };

  const sustainabilityScore =
    Number(metrics.sustainabilityScore) || 0;

  const co2Emission =
    Number(metrics.co2Emission) || 0;

  const energyConsumption =
    Number(metrics.energyConsumption) || 0;

  const grade = getGrade(sustainabilityScore);

  // =========================================
  // Carbon Color
  // =========================================

  const getCarbonColor = (value) => {
    if (value <= 5) {
      return "text-emerald-400";
    }

    if (value <= 20) {
      return "text-cyan-400";
    }

    if (value <= 50) {
      return "text-amber-400";
    }

    if (value <= 100) {
      return "text-orange-400";
    }

    return "text-red-400";
  };

  // =========================================
  // Metric Cards
  // =========================================

  const metricCards = [
    {
      icon: FaCloud,
      label: "Carbon Emission",
      value: formatCarbon(co2Emission),
      color: getCarbonColor(co2Emission),
      bg: "bg-emerald-500/10"
    },

    {
      icon: FaLeaf,
      label: "Sustainability Score",
      value: `${sustainabilityScore}%`,
      color:
        sustainabilityScore >= 75
          ? "text-emerald-400"
          : sustainabilityScore >= 50
          ? "text-amber-400"
          : "text-red-400",
      bg: "bg-cyan-500/10"
    },

    {
      icon: FaAward,
      label: "Grade",
      value: grade.letter,
      color: grade.color,
      bg: grade.bg
    },

    {
      icon: FaBolt,
      label: "Energy Consumption",
      value: `${(energyConsumption * 1000).toFixed(2)} Wh`,
      color: "text-orange-400",
      bg: "bg-orange-500/10"
    }
  ];

  // =========================================
  // UI
  // =========================================

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

      {metricCards.map((item, index) => (
        <Card
          key={index}
          className="bg-[#111827] border border-gray-800 p-5"
        >
          <div className="flex items-center gap-4">

            {/* Icon */}
            <div
              className={`p-3 rounded-xl ${item.bg}`}
            >
              <item.icon
                className={item.color}
                size={24}
              />
            </div>

            {/* Content */}
            <div className="min-w-0">
              <p className="text-sm text-gray-400">
                {item.label}
              </p>

              <p
                className={`text-2xl font-bold ${item.color} truncate`}
              >
                {item.value}
              </p>
            </div>

          </div>
        </Card>
      ))}

    </div>
  );
};

export default AnalysisMetrics;