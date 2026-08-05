// frontend/src/components/analysis/AnalysisActions.jsx
import React from 'react';
import { FaFilePdf, FaFileCsv, FaSync, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';

const AnalysisActions = ({ 
  onExportPDF, 
  onExportCSV, 
  onReanalyze,
  loading 
}) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-[#111827] border border-gray-800 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          onClick={() => navigate('/repository')}
          className="flex items-center gap-2"
        >
          <FaArrowLeft /> Back
        </Button>

        <div className="flex-1"></div>

       

        <Button
          variant="secondary"
          onClick={onExportPDF}
          className="flex items-center gap-2"
        >
          <FaFilePdf /> Export PDF
        </Button>

        <Button
          variant="secondary"
          onClick={onExportCSV}
          className="flex items-center gap-2"
        >
          <FaFileCsv /> Export CSV
        </Button>

         <Button
          variant="primary"
          onClick={onReanalyze}
          loading={loading}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <FaSync className={loading ? 'animate-spin' : ''} /> 
          Re-analyze
        </Button>
      </div>
    </Card>
  );
};

export default AnalysisActions;