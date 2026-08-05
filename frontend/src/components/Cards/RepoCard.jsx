// frontend/src/components/cards/RepoCard.jsx
import React from 'react';
import { FaStar, FaCodeBranch, FaExclamationCircle, FaClock } from 'react-icons/fa';
import Card from '../common/Card';
import Button from '../common/Button';

const RepoCard = ({ 
  name, 
  description, 
  stars, 
  forks, 
  issues, 
  updatedAt,
  language,
  languageColor = '#10B981',
  onAnalyze 
}) => {
  return (
    <Card className="hover:border-primary-500/30 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white hover:text-primary-500 transition-colors cursor-pointer">
            {name}
          </h4>
          <p className="text-sm text-dark-400 mt-1 line-clamp-2">{description || 'No description provided'}</p>
          
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {language && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: languageColor }}></span>
                <span className="text-xs text-dark-300">{language}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-dark-400">
              <FaStar className="text-yellow-500" />
              <span>{stars}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-dark-400">
              <FaCodeBranch className="text-primary-500" />
              <span>{forks}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-dark-400">
              <FaExclamationCircle className="text-red-500" />
              <span>{issues}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-dark-400">
              <FaClock />
              <span>Updated {updatedAt}</span>
            </div>
          </div>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          className="ml-4 flex-shrink-0"
          onClick={onAnalyze}
        >
          Analyze
        </Button>
      </div>
    </Card>
  );
};

export default RepoCard;