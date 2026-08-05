// frontend/src/components/analysis/AnalysisHeader.jsx
import React from 'react';
import { 
  FaGithub, 
  FaLock, 
  FaGlobe, 
  FaClock,
  FaCode
} from 'react-icons/fa';
import Card from '../common/Card';

const AnalysisHeader = ({ analysis }) => {
  if (!analysis) return null;

  const { repository } = analysis;

  return (
    <Card className="bg-[#111827] border border-gray-800 p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Left Section */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <FaGithub className="text-emerald-400 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {repository?.repositoryName || 'Repository'}
              </h1>
              <p className="text-gray-400">
                {repository?.owner || 'Unknown Owner'}
              </p>
              {repository?.description && (
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            {repository.description}
            </p>)
}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {repository?.language && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                <FaCode size={12} />
                {repository.language}
              </span>
            )}
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${
              repository?.isPrivate 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {repository?.visibility === "private" ? <FaLock size={12} /> : <FaGlobe size={12} />}
              {repository?.visibility === "private"? 'Private' : 'Public'}
            </span>
            {repository?.lastAnalyzed && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                <FaClock size={12} />
                Last Scan: {new Date(repository.lastAnalyzed).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Right Section - Quick Stats */}
        <div className="flex flex-wrap gap-4 md:gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {repository?.stars?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500">Stars</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {repository?.forks?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500">Forks</p>
          </div>
          </div>
      </div>
    </Card>
  );
};

export default AnalysisHeader;