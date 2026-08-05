// frontend/src/components/repository/RepositoryCard.jsx
import React, { useState } from 'react';
import { 
  FaGithub, 
  FaStar, 
  FaCodeBranch, 
  FaExclamationCircle,
  FaChartLine,
  FaFileAlt,
  FaLeaf,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';
import Card from '../common/Card';
import Button from '../common/Button';

const RepositoryCard = ({ 
  repository, 
  onAnalyze, 
  onReports, 
  loading 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getSustainabilityColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getCarbonColor = (score) => {
    if (score <= 30) return 'text-emerald-400';
    if (score <= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getSustainabilityBg = (score) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await onAnalyze(repository._id);
    setIsAnalyzing(false);
  };

  
  return (
    <Card className="w-full bg-[#111827] border border-gray-800 rounded-2xl hover:border-emerald-500/40 transition-all duration-300 p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left Section */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl flex-shrink-0">
              <FaGithub className="text-emerald-400 text-xl" />
            </div>
<div className="min-w-0">

  <div className="flex items-center gap-2">

    <h3 className="text-xl font-bold font-semibold text-white truncate hover:text-emerald-400 transition-colors">
      {repository.repositoryName}
    </h3>

    <span className="
      px-2
      py-1
      rounded
      bg-gray-800
      text-xs
      text-gray-300
      border
      border-gray-700
    ">
      {repository.visibility}
    </span>

  </div>

  <p className="text-sm text-gray-400 truncate">
    {repository.owner}
  </p>

</div>
          </div>

          {/* Description */}
          {repository.description && (
            <p className="mt-3 text-sm text-gray-400 leading-6 line-clamp-2">
              {repository.description}
            </p>
          )}

          {/* Language & Stats */}
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {repository.language && (
              <span className="flex items-center gap-1.5 text-xs text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                {repository.language}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <FaStar className="text-amber-400" />
              {repository.stars?.toLocaleString() || 0}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <FaCodeBranch className="text-emerald-400" />
              {repository.forks?.toLocaleString() || 0}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <FaExclamationCircle className="text-red-400" />

            </span>
          </div>

          {/* Last Analyzed */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
            <FaClock size={12} />
            <span>Analyzed: {repository.lastAnalyzed ? new Date(repository.lastAnalyzed).toLocaleDateString() : 'Never'}</span>
          </div>
        </div>

        {/* Right Section - Scores & Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 sm:gap-4 lg:gap-2">
          {/* Scores */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg ${getSustainabilityBg(repository.sustainabilityScore)}`}>
              <div className="flex items-center gap-1.5">
                <FaLeaf className={getSustainabilityColor(repository.sustainabilityScore)} size={14} />
                <span className="text-sm font-medium text-white">{repository.sustainabilityScore || 0}%</span>
                <span className="text-xs text-gray-500">Sustainability</span>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-lg ${getSustainabilityBg(100 - (repository.carbonEmmision || 0))}`}>
              <div className="flex items-center gap-1.5">
                <FaChartLine className={getCarbonColor(repository.carbonEmmision || 0)} size={14} />
            <span className="text-sm font-medium text-white">
              {repository.carbonEmission || 0} gCO₂
               </span>             
                  <span className="text-xs text-gray-500">Carbon</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
           <Button
    variant="primary"
    size="sm"
    onClick={handleAnalyze}
    loading={isAnalyzing}
    disabled={isAnalyzing}
    className="
        bg-emerald-500
        hover:bg-emerald-600
        text-white
        rounded-xl
        px-5
        py-2
        flex
        items-center
        gap-2
        transition-all
    "
>
    <FaChartLine />
    {isAnalyzing ? "Analyzing..." : "Analyze"}
</Button>
           <Button
  variant="secondary"
  size="sm"
  onClick={() => onReports(repository._id)}
  className="
    border
    border-gray-700
    hover:border-emerald-500
    hover:text-emerald-400
    rounded-xl
    px-5
    py-2
    flex
    items-center
    gap-2
    transition-all
  "
>
  <FaFileAlt />
  Report
</Button>
           
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RepositoryCard;