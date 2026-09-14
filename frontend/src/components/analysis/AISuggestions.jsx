// frontend/src/components/analysis/AISuggestions.jsx

import React, { useEffect, useState } from "react";
import {
  FaRobot,
  FaBolt,
  FaLeaf,
  FaTachometerAlt,
  FaCubes,
  FaBoxOpen,
  FaSyncAlt,
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";

import Card from "../common/Card";
import Button from "../common/Button";
import aiSuggestionService from "../../services/aiSuggestionService";

// Icon + color per suggestion category — keeps the card scannable at a glance
const CATEGORY_META = {
  energy: { icon: FaBolt, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  carbon: { icon: FaLeaf, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  performance: { icon: FaTachometerAlt, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  architecture: { icon: FaCubes, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  dependency: { icon: FaBoxOpen, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" }
};

const IMPACT_META = {
  high: "bg-red-500/15 text-red-400 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  low: "bg-gray-500/15 text-gray-400 border-gray-500/30"
};

const AISuggestions = ({ analysisId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");

  const fetchSuggestions = async (regenerate = false) => {
    if (regenerate) {
      setRegenerating(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const data = await aiSuggestionService.getSuggestions(analysisId, regenerate);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load AI suggestions right now. Please try again."
      );
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    if (analysisId) {
      fetchSuggestions(false);
    }
  }, [analysisId]);

  // ===================================
  // NO ANALYSIS STATE
  // ===================================
  if (!analysisId) {
    return (
      <Card className="bg-[#111827] border border-gray-800 p-5">
        <div className="text-center py-8">
          <FaRobot className="text-4xl text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
          <p className="text-gray-400 mt-2">
            Analyze a repository first to get AI-powered suggestions.
          </p>
        </div>
      </Card>
    );
  }

  // ===================================
  // LOADING STATE
  // ===================================
  if (loading) {
    return (
      <Card className="bg-[#111827] border border-gray-800 p-5">
        <div className="flex items-center gap-2 mb-5">
          <FaRobot className="text-emerald-400 text-xl" />
          <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <FaSpinner className="text-3xl text-emerald-400 animate-spin mb-3" />
          <p className="text-gray-400 text-sm">
            Analyzing your repository with AI — this can take a few seconds...
          </p>
        </div>
      </Card>
    );
  }

  // ===================================
  // ERROR STATE
  // ===================================
  if (error) {
    return (
      <Card className="bg-[#111827] border border-gray-800 p-5">
        <div className="flex items-center gap-2 mb-5">
          <FaRobot className="text-emerald-400 text-xl" />
          <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
        </div>
        <div className="text-center py-8">
          <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-3" />
          <p className="text-gray-300">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => fetchSuggestions(false)}
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  // ===================================
  // EMPTY STATE (AI returned, but nothing usable — rare, defensive)
  // ===================================
  if (suggestions.length === 0) {
    return (
      <Card className="bg-[#111827] border border-gray-800 p-5">
        <div className="flex items-center gap-2 mb-5">
          <FaRobot className="text-emerald-400 text-xl" />
          <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
        </div>
        <div className="text-center py-8">
          <FaBoxOpen className="text-4xl text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No suggestions generated yet.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => fetchSuggestions(true)}
          >
            Generate Suggestions
          </Button>
        </div>
      </Card>
    );
  }

  // ===================================
  // MAIN CONTENT
  // ===================================
  return (
    <Card className="bg-[#111827] border border-gray-800 p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FaRobot className="text-emerald-400 text-xl" />
          <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchSuggestions(true)}
          loading={regenerating}
        >
          {!regenerating && <FaSyncAlt />}
          Regenerate
        </Button>
      </div>

      <div className="space-y-3">
        {suggestions.map((s) => {
          const meta = CATEGORY_META[s.suggestionType] || CATEGORY_META.architecture;
          const Icon = meta.icon;

          return (
            <div
              key={s._id || s.title}
              className={`flex items-start gap-3 p-4 rounded-xl ${meta.bg} border ${meta.border} hover:brightness-110 transition-all`}
            >
              <Icon className={`${meta.color} mt-1 flex-shrink-0 text-lg`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <h4 className="text-white font-medium">{s.title}</h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${IMPACT_META[s.impact] || IMPACT_META.medium}`}
                  >
                    {s.impact} impact
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AISuggestions;
