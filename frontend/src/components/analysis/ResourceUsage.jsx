import React from "react";
import {
  FaMicrochip,
  FaMemory,
  FaNetworkWired,
  FaDatabase
} from "react-icons/fa";
import Card from "../common/Card";

const ResourceUsage = ({ usage }) => {

  if (!usage) return null;

  const resourceItems = [
    {
      icon: FaMicrochip,
      label: "CPU Usage",
      value: usage.cpuUsage || 42,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: FaMemory,
      label: "Memory Usage",
      value: usage.memoryUsage || 63,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      icon: FaNetworkWired,
      label: "Network Usage",
      value: usage.networkUsage || 18,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10"
    },
    {
      icon: FaDatabase,
      label: "Storage Usage",
      value: usage.storageUsage || 37,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    }
  ];

  const getBarColor = (value) => {
    if (value < 30) return "bg-emerald-400";
    if (value < 60) return "bg-amber-400";
    if (value < 80) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <Card className="bg-[#111827] border border-gray-800 p-5">
      <h3 className="text-lg font-semibold text-white mb-5">
        Resource Usage
      </h3>

      <div className="space-y-4">
        {resourceItems.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <item.icon className={item.color} />
                </div>

                <span className="text-gray-300 text-sm">
                  {item.label}
                </span>
              </div>

              <span className="text-white font-medium">
                {item.value}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${getBarColor(item.value)}`}
                style={{
                  width: `${item.value}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ResourceUsage;