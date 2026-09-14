import React from "react";
import {
  FaMicrochip,
  FaNetworkWired,
  FaDatabase
} from "react-icons/fa";
import Card from "../common/Card";

const ResourceUsage = ({ usage }) => {
  if (!usage) return null;

  const breakdown = usage.energyBreakdown || {};

  const ciEnergy = Number(breakdown.ciEnergyKWh || 0);
  const storageEnergy = Number(breakdown.storageEnergyKWh || 0);
  const networkEnergy = Number(breakdown.networkEnergyKWh || 0);

  // Use the final energy value calculated and stored by backend.
  const totalEnergy = Number(
    usage.energyConsumption || 0
  );

  const getPercentage = (value) => {
    if (totalEnergy <= 0) return 0;

    return Math.min(
      100,
      (value / totalEnergy) * 100
    );
  };

  const resourceItems = [
    {
      icon: FaMicrochip,
      label: "CI/CD Compute",
      value: ciEnergy,
      percentage: getPercentage(ciEnergy),
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: FaDatabase,
      label: "Repository Storage",
      value: storageEnergy,
      percentage: getPercentage(storageEnergy),
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: FaNetworkWired,
      label: "Dependencies / Network",
      value: networkEnergy,
      percentage: getPercentage(networkEnergy),
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    }
  ];

  const getBarColor = (percentage) => {
    if (percentage < 30) return "bg-emerald-400";
    if (percentage < 60) return "bg-amber-400";
    if (percentage < 80) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <Card className="bg-[#111827] border border-gray-800 p-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Energy Usage
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Estimated energy contribution by component
          </p>
        </div>

        <div className="text-sm text-gray-400">
          Total:{" "}
          <span className="text-white font-medium">
            {(totalEnergy * 1000).toFixed(2)} Wh
          </span>
        </div>
      </div>

      {/* Energy Components */}
      <div className="space-y-5">
        {resourceItems.map((item, index) => (
          <div key={index}>
            
            {/* Label + Value */}
            <div className="flex justify-between items-center mb-2">
              
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${item.bgColor}`}
                >
                  <item.icon className={item.color} />
                </div>

                <span className="text-gray-300 text-sm truncate">
                  {item.label}
                </span>
              </div>

              <div className="text-right flex-shrink-0 ml-3">
                <span className="text-white font-medium">
                  {(item.value * 1000).toFixed(2)} Wh
                </span>

                <span className="text-gray-500 text-xs ml-2">
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>

            </div>

            {/* Progress Bar */}
            <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getBarColor(
                  item.percentage
                )}`}
                style={{
                  width: `${item.percentage}%`
                }}
              />
            </div>

          </div>
        ))}
      </div>

      {/* Empty State */}
      {totalEnergy <= 0 && (
        <p className="text-sm text-gray-500 mt-5">
          No measurable energy contribution was detected for this analysis.
        </p>
      )}

    </Card>
  );
};

export default ResourceUsage;