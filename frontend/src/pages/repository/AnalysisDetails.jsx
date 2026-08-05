// frontend/src/pages/AnalysisDetails.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

import AnalysisHeader from "../../components/analysis/AnalysisHeader";
import AnalysisMetrics from "../../components/analysis/AnalysisMetrics";
import ResourceUsage from "../../components/analysis/ResourceUsage";
import RecommendationList from "../../components/analysis/RecommendationList";
import AnalysisActions from "../../components/analysis/AnalysisActions";

import analysisService from "../../services/analysisService";
const AnalysisDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

const response =
    await analysisService.getAnalysisByRepository(id);
      setAnalysis(response.analysis);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load analysis details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Export PDF
  // ===========================

  const handleExportPDF = async () => {
    try {
      setExporting(true);

const blob = await analysisService.exportPDF(analysis._id);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

link.download = `${analysis.repository.repositoryName}.pdf`;
      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to export PDF.");
    } finally {
      setExporting(false);
    }
  };

  // ===========================
  // Export CSV
  // ===========================

  const handleExportCSV = async () => {
    try {
      setExporting(true);

const blob = await analysisService.exportCSV(analysis._id);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

link.download = `${analysis.repository.repositoryName}.csv`;
      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to export CSV.");
    } finally {
      setExporting(false);
    }
  };

  // ===========================
  // Analyze Again
  // ===========================

  const handleReanalyze = async () => {
    try {
      setReanalyzing(true);

      await analysisService.analyzeRepository(
        analysis.repository._id
      );

      await fetchAnalysis();
    } catch (err) {
      console.error(err);
      alert("Re-analysis failed.");
    } finally {
      setReanalyzing(false);
    }
  };

  // ===========================
  // Loading
  // ===========================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-emerald-400 animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">
            Loading Analysis...
          </p>
        </div>
      </div>
    );
  }

  // ===========================
  // Error
  // ===========================

  if (error) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">

          <h2 className="text-red-400 text-xl font-semibold">
            {error}
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 px-5 py-2 bg-emerald-500 rounded-lg text-white hover:bg-emerald-600"
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="min-h-screen bg-[#030712]">

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Page Title */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-white">
            Analysis Details
          </h1>

          <p className="text-gray-400 mt-2">
            Complete sustainability analysis of your repository.
          </p>

        </div>

        {/* Actions */}

        <AnalysisActions
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportCSV}
          onReanalyze={handleReanalyze}
          loading={exporting || reanalyzing}
        />

        <div className="space-y-6 mt-6">

          <AnalysisHeader
            analysis={analysis}
          />

          <AnalysisMetrics
            metrics={analysis}
          />

          <ResourceUsage
            usage={analysis}
          />

          <RecommendationList
            recommendations={analysis.recommendations}
          />

        </div>

      </div>

    </div>
  );
};

export default AnalysisDetails;