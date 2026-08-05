// frontend/src/components/analysis/RecommendationList.jsx

import React from "react";
import { FaCheckCircle, FaLightbulb } from "react-icons/fa";
import Card from "../common/Card";

const RecommendationList = ({ recommendations }) => {

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="bg-[#111827] border border-gray-800 p-5">
        <div className="text-center py-8">

          <FaLightbulb
            className="text-4xl text-gray-600 mx-auto mb-3"
          />

          <h3 className="text-lg font-semibold text-white">
            AI Recommendations
          </h3>

          <p className="text-gray-400 mt-2">
            No recommendations available
          </p>

          <p className="text-sm text-gray-500">
            Run repository analysis to generate recommendations.
          </p>

        </div>
      </Card>
    );
  }

  return (

    <Card className="bg-[#111827] border border-gray-800 p-5">

      <div className="flex items-center gap-2 mb-5">

        <FaLightbulb className="text-yellow-400 text-xl" />

        <h3 className="text-lg font-semibold text-white">
          AI Recommendations
        </h3>

      </div>

      <div className="space-y-3">

        {recommendations.map((recommendation, index) => (

          <div
            key={index}
            className="
              flex
              items-start
              gap-3
              p-4
              rounded-xl
              bg-emerald-500/10
              border
              border-emerald-500/20
              hover:border-emerald-500/40
              transition-all
            "
          >

            <FaCheckCircle
              className="text-emerald-400 mt-1 flex-shrink-0"
            />

            <p className="text-gray-200 leading-relaxed">
              {recommendation}
            </p>

          </div>

        ))}

      </div>

    </Card>

  );
};

export default RecommendationList;