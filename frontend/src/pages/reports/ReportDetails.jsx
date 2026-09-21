import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  FaArrowLeft,
  FaFileAlt,
  FaFileCsv,
  FaLeaf,
  FaBolt,
  FaCloud,
  FaChartLine,
  FaLightbulb,
  FaDownload,
} from "react-icons/fa";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import reportService from "../../services/reportService";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  // ==========================================
  // Fetch Report
  // ==========================================

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await reportService.getReportById(id);

        setReport(response.data);

      } catch (err) {
        console.error(
          "Get Report Details Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load report details."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);


  // ==========================================
  // Download Report
  // ==========================================

  const handleDownload = async () => {
    try {
      setDownloadLoading(true);

      const token =
        localStorage.getItem("token");

      const analysisId =
        typeof report.analysis === "object"
          ? report.analysis?._id
          : report.analysis;

      if (!analysisId) {
        throw new Error(
          "Analysis information not found for this report."
        );
      }

      const type =
        report.reportType === "CSV"
          ? "csv"
          : "pdf";

      const response = await axios.get(
        `${API_URL}/export/${type}/${analysisId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob(
        [response.data],
        {
          type:
            type === "pdf"
              ? "application/pdf"
              : "text/csv",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${report.repository?.repositoryName || "sustainability-report"}.${type}`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(
        "Report Download Error:",
        err
      );

      alert(
        err.message ||
          "Unable to download report."
      );

    } finally {
      setDownloadLoading(false);
    }
  };


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="p-4 sm:p-6">

        <Card>
          <div className="flex flex-col items-center justify-center py-16">

            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />

            <p className="text-dark-400 mt-4">
              Loading report...
            </p>

          </div>
        </Card>

      </div>
    );
  }


  // ==========================================
  // Error
  // ==========================================

  if (error || !report) {
    return (
      <div className="p-4 sm:p-6">

        <Card>

          <div className="text-center py-12">

            <p className="text-red-400 mb-5">
              {error || "Report not found."}
            </p>

            <Button
              variant="secondary"
              onClick={() =>
                navigate("/reports")
              }
            >
              <FaArrowLeft />
              Back to Reports
            </Button>

          </div>

        </Card>

      </div>
    );
  }


  // ==========================================
  // Report Data
  // ==========================================

  const repositoryName =
    report.repository?.repositoryName ||
    "Unknown Repository";

  const repositoryOwner =
    report.repository?.owner || "";

  const repositoryLanguage =
    report.repository?.language ||
    "Unknown";

  const recommendations =
    Array.isArray(report.recommendations)
      ? report.recommendations
      : [];

  const isCSV =
    report.reportType === "CSV";


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">

      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <div>

        <p
          onClick={() =>
            navigate("/reports")
          }
          className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white cursor-pointer transition mb-3"
        >
          <FaArrowLeft size={13} />
          Back to Reports
        </p>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

          <div className="min-w-0">

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white break-words">
              {report.reportName}
            </h1>

            <p className="text-dark-400 mt-2 text-sm sm:text-base">
              Sustainability report for{" "}
              <span className="text-white">
                {repositoryName}
              </span>
            </p>

          </div>

          {/* Download Button */}

          <Button
            variant={
              isCSV
                ? "success"
                : "danger"
            }
            loading={downloadLoading}
            disabled={downloadLoading}
            onClick={handleDownload}
            className="w-full sm:w-auto flex-shrink-0"
          >

            {isCSV ? (
              <FaFileCsv />
            ) : (
              <FaFileAlt />
            )}

            {isCSV
              ? "Download CSV"
              : "Download PDF"}

          </Button>

        </div>

      </div>


      {/* ======================================
          ACTION BAR
      ======================================= */}

      <Card className="p-4 sm:p-5">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex items-center gap-3 min-w-0">

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">

              {isCSV ? (
                <FaFileCsv
                  className="text-green-400"
                  size={18}
                />
              ) : (
                <FaFileAlt
                  className="text-red-400"
                  size={18}
                />
              )}

            </div>

            <div className="min-w-0">

              <p className="text-white font-semibold">
                Sustainability Report
              </p>

              <p className="text-dark-400 text-xs sm:text-sm truncate">
                Generated report for {repositoryName}
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2 flex-wrap">

            <span
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm border ${
                isCSV
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >

              {isCSV ? (
                <FaFileCsv />
              ) : (
                <FaFileAlt />
              )}

              {report.reportType || "PDF"}

            </span>

            <span className="text-xs sm:text-sm text-dark-500">
              {report.generatedAt
                ? new Date(
                    report.generatedAt
                  ).toLocaleDateString()
                : "-"}
            </span>

          </div>

        </div>

      </Card>


      {/* ======================================
          REPOSITORY INFORMATION
      ======================================= */}

      <Card>

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">

            <FaFileAlt className="text-primary-400" />

          </div>

          <div>

            <h2 className="text-lg font-semibold text-white">
              Report Information
            </h2>

            <p className="text-sm text-dark-400">
              Basic information about this sustainability report.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

          <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4">

            <p className="text-xs text-dark-400">
              Repository
            </p>

            <p className="text-white font-medium mt-1 break-words">
              {repositoryName}
            </p>

          </div>


          <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4">

            <p className="text-xs text-dark-400">
              Owner
            </p>

            <p className="text-white font-medium mt-1 break-words">
              {repositoryOwner || "-"}
            </p>

          </div>


          <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4">

            <p className="text-xs text-dark-400">
              Language
            </p>

            <p className="text-white font-medium mt-1">
              {repositoryLanguage}
            </p>

          </div>


          <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4">

            <p className="text-xs text-dark-400">
              Report Type
            </p>

            <p className="text-white font-medium mt-1">
              {report.reportType || "PDF"}
            </p>

          </div>


          <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 sm:col-span-2">

            <p className="text-xs text-dark-400">
              Generated On
            </p>

            <p className="text-white font-medium mt-1">
              {report.generatedAt
                ? new Date(
                    report.generatedAt
                  ).toLocaleString()
                : "-"}
            </p>

          </div>

        </div>

      </Card>


      {/* ======================================
          SUSTAINABILITY OVERVIEW
      ======================================= */}

      <div>

        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
          Sustainability Overview
        </h2>


        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">

          {/* Carbon */}

          <Card hoverable>

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm text-dark-400">
                  Carbon Score
                </p>

                <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
                  {report.carbonScore ?? 0}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">

                <FaLeaf
                  className="text-primary-400"
                  size={20}
                />

              </div>

            </div>

          </Card>


          {/* Sustainability */}

          <Card hoverable>

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm text-dark-400">
                  Sustainability Score
                </p>

                <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
                  {report.sustainabilityScore ?? 0}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">

                <FaChartLine
                  className="text-green-400"
                  size={20}
                />

              </div>

            </div>

          </Card>


          {/* Energy */}

          <Card hoverable>

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm text-dark-400">
                  Energy Consumption
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-white mt-2 break-all">
                  {report.energyConsumption ?? 0}
                </p>

                <p className="text-xs text-dark-500 mt-1">
                  kWh
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">

                <FaBolt
                  className="text-yellow-400"
                  size={20}
                />

              </div>

            </div>

          </Card>


          {/* CO2 */}

          <Card hoverable>

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm text-dark-400">
                  CO₂ Emission
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-white mt-2 break-all">
                  {report.co2Emission ?? 0}
                </p>

                <p className="text-xs text-dark-500 mt-1">
                  gCO₂
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">

                <FaCloud
                  className="text-blue-400"
                  size={20}
                />

              </div>

            </div>

          </Card>

        </div>

      </div>


      {/* ======================================
          RECOMMENDATIONS
      ======================================= */}

      <Card>

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">

            <FaLightbulb className="text-yellow-400" />

          </div>

          <div>

            <h2 className="text-lg sm:text-xl font-semibold text-white">
              AI Recommendations
            </h2>

            <p className="text-sm text-dark-400">
              Suggestions to improve repository sustainability.
            </p>

          </div>

        </div>


        {recommendations.length > 0 ? (

          <div className="space-y-3">

            {recommendations.map(
              (recommendation, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3 bg-dark-900/50 border border-dark-700 rounded-xl p-4 hover:border-primary-500/30 transition"
                >

                  <div className="w-7 h-7 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center text-xs font-semibold flex-shrink-0">

                    {index + 1}

                  </div>

                  <p className="text-sm text-dark-300 leading-6">
                    {recommendation}
                  </p>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-5">

            <p className="text-sm text-dark-400">
              No recommendations available for this report.
            </p>

          </div>

        )}

      </Card>


      {/* ======================================
          MOBILE DOWNLOAD
      ======================================= */}

      <div className="block sm:hidden pb-2">

        <Button
          variant={
            isCSV
              ? "success"
              : "danger"
          }
          loading={downloadLoading}
          disabled={downloadLoading}
          onClick={handleDownload}
          className="w-full"
        >

          <FaDownload />

          Download{" "}
          {isCSV ? "CSV" : "PDF"}

        </Button>

      </div>

    </div>
  );
};

export default ReportDetails;