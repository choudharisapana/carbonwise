// frontend/src/components/analysis/AnalysisMetrics.jsx
import React from 'react';
import { FaLeaf, FaBolt, FaAward,FaCloud } from 'react-icons/fa';
import Card from '../common/Card';

const AnalysisMetrics = ({ metrics }) => {
  if (!metrics) return null;

  const getGrade = (score) => {
    if (score >= 90) return { letter: 'A', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (score >= 75) return { letter: 'B', color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
    if (score >= 60) return { letter: 'C', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    if (score >= 40) return { letter: 'D', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { letter: 'F', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const grade = getGrade(metrics.sustainabilityScore || 0);

  const metricCards = [
  {
    icon: FaCloud,
    label: "Carbon Emission",
    value: `${metrics.carbonEmission?.toFixed(2) || 0} gCO₂`,
    color:
      (metrics.carbonEmission || 0) < 30
        ? "text-emerald-400"
        : (metrics.carbonEmission || 0) < 60
        ? "text-amber-400"
        : "text-red-400",
    bg: "bg-emerald-500/10"
  },

  {
    icon: FaLeaf,
    label: "Sustainability Score",
    value: `${metrics.sustainabilityScore || 0}%`,
    color:
      (metrics.sustainabilityScore || 0) >= 75
        ? "text-emerald-400"
        : (metrics.sustainabilityScore || 0) >= 50
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
    value: `${metrics.energyConsumption || 0} Wh`,
    color: "text-orange-400",
    bg: "bg-orange-500/10"
  }
];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metricCards.map((item, index) => (
        <Card key={index} className="bg-[#111827] border border-gray-800 p-5">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${item.bg || 'bg-gray-800/50'}`}>
              <item.icon className={item.color} size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color}`}>
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