import { useEffect, useState } from "react";
import reportService from "../../services/reportService";

import ReportStats from "../../components/reports/ReportStats";
import ReportSearch from "../../components/reports/ReportSearch";
import ReportFilters from "../../components/reports/ReportFilters";
import ReportTable from "../../components/reports/ReportTable";
import DeleteReportModal from "../../components/reports/DeleteReportModal";
const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportService.getReports();

      setReports(response.data || []);
    } catch (error) {
      console.error("Fetch Reports Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const reportName = report.reportName?.toLowerCase() || "";

    const repositoryName =
      report.repository?.repositoryName?.toLowerCase() || "";

    const matchesSearch =
      reportName.includes(searchTerm.toLowerCase()) ||
      repositoryName.includes(searchTerm.toLowerCase());

    // Agar reportType abhi database me nahi hai
    // to All filter hi work karega
    const matchesFilter =
      activeFilter === "All" ||
      report.reportType === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await reportService.deleteReport(selectedReportId);

      setReports((prev) =>
        prev.filter((report) => report._id !== selectedReportId)
      );

      setDeleteModalOpen(false);
      setSelectedReportId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDownload = (report) => {
    console.log("Download:", report);
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading Reports...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold">
        Reports
      </h1>

      <p className="text-gray-500 mt-2">
        Manage all generated sustainability reports.
      </p>

      <div className="mt-8">
        <ReportStats reports={reports} />

        <div className="my-6">
          <ReportSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="mb-6">
          <ReportFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        <ReportTable
          reports={filteredReports}
          onDelete={(id) => {
            setSelectedReportId(id);
            setDeleteModalOpen(true);
          }}
          onDownload={handleDownload}
        />
      </div>

      <DeleteReportModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Reports;