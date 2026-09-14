// import { useEffect, useState } from "react";
// import reportService from "../../services/reportService";

// import ReportStats from "../../components/reports/ReportStats";
// import ReportSearch from "../../components/reports/ReportSearch";
// import ReportFilters from "../../components/reports/ReportFilters";
// import ReportTable from "../../components/reports/ReportTable";
// import DeleteReportModal from "../../components/reports/DeleteReportModal";
// const Reports = () => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState("All");

//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedReportId, setSelectedReportId] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     try {
//       const response = await reportService.getReports();

//       setReports(response.data || []);
//     } catch (error) {
//       console.error("Fetch Reports Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredReports = reports.filter((report) => {
//     const reportName = report.reportName?.toLowerCase() || "";

//     const repositoryName =
//       report.repository?.repositoryName?.toLowerCase() || "";

//     const matchesSearch =
//       reportName.includes(searchTerm.toLowerCase()) ||
//       repositoryName.includes(searchTerm.toLowerCase());

//     // Agar reportType abhi database me nahi hai
//     // to All filter hi work karega
//     const matchesFilter =
//       activeFilter === "All" ||
//       report.reportType === activeFilter;

//     return matchesSearch && matchesFilter;
//   });

//   const handleDelete = async () => {
//     try {
//       setDeleteLoading(true);

//       await reportService.deleteReport(selectedReportId);

//       setReports((prev) =>
//         prev.filter((report) => report._id !== selectedReportId)
//       );

//       setDeleteModalOpen(false);
//       setSelectedReportId(null);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleDownload = (report) => {
//     console.log("Download:", report);
//   };

//   if (loading) {
//     return (
//       <div className="p-6">
//         Loading Reports...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">

//       <h1 className="text-3xl font-bold">
//         Reports
//       </h1>

//       <p className="text-gray-500 mt-2">
//         Manage all generated sustainability reports.
//       </p>

//       <div className="mt-8">
//         <ReportStats reports={reports} />

//         <div className="my-6">
//           <ReportSearch
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//           />
//         </div>

//         <div className="mb-6">
//           <ReportFilters
//             activeFilter={activeFilter}
//             setActiveFilter={setActiveFilter}
//           />
//         </div>

//         <ReportTable
//           reports={filteredReports}
//           onDelete={(id) => {
//             setSelectedReportId(id);
//             setDeleteModalOpen(true);
//           }}
//           onDownload={handleDownload}
//         />
//       </div>

//       <DeleteReportModal
//         isOpen={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//       />
//     </div>
//   );
// };

// export default Reports;
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

  const [downloadLoading, setDownloadLoading] = useState(null);


  // =====================================
  // Fetch Reports
  // =====================================

  useEffect(() => {
    fetchReports();
  }, []);


  const fetchReports = async () => {

    try {

      setLoading(true);

      const response =
        await reportService.getReports();

      const fetchedReports =
        response.data || [];

      /*
       * Older reports may not have reportType
       * because they were created before reportType
       * was added to the schema.
       *
       * Since the old system generated PDF reports
       * by default, treat missing type as PDF.
       */

      const normalizedReports =
        fetchedReports.map((report) => ({
          ...report,
          reportType:
            report.reportType || "PDF",
        }));

      setReports(normalizedReports);

    } catch (error) {

      console.error(
        "Fetch Reports Error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================
  // Search + Filter
  // =====================================

  const filteredReports =
    reports.filter((report) => {

      const reportName =
        report.reportName
          ?.toLowerCase() || "";

      const repositoryName =
        report.repository
          ?.repositoryName
          ?.toLowerCase() || "";

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      const matchesSearch =
        reportName.includes(search) ||
        repositoryName.includes(search);

      const matchesFilter =
        activeFilter === "All" ||
        report.reportType === activeFilter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });


  // =====================================
  // Delete Report
  // =====================================

  const handleDelete = async () => {

    if (!selectedReportId) {
      return;
    }

    try {

      setDeleteLoading(true);

      await reportService.deleteReport(
        selectedReportId
      );

      setReports((prev) =>
        prev.filter(
          (report) =>
            report._id !== selectedReportId
        )
      );

      setDeleteModalOpen(false);

      setSelectedReportId(null);

    } catch (error) {

      console.error(
        "Delete Report Error:",
        error
      );

    } finally {

      setDeleteLoading(false);

    }
  };


  // =====================================
  // Download Report
  // =====================================

  const handleDownload = async (report) => {

    try {

      if (!report.analysis?._id) {

        console.error(
          "Analysis ID not found for report."
        );

        return;
      }

      setDownloadLoading(report._id);


      let response;


      // PDF
      if (report.reportType === "PDF") {

        response =
          await reportService.downloadPDF(
            report.analysis._id
          );

      }

      // CSV
      else if (report.reportType === "CSV") {

        response =
          await reportService.downloadCSV(
            report.analysis._id
          );

      }

      else {

        console.error(
          "Unknown report type:",
          report.reportType
        );

        return;
      }


      // =====================================
      // Create browser download
      // =====================================

      const blob =
        new Blob(
          [response.data],
          {
            type:
              report.reportType === "PDF"
                ? "application/pdf"
                : "text/csv",
          }
        );


      const url =
        window.URL.createObjectURL(blob);


      const link =
        document.createElement("a");

      link.href = url;


      const repositoryName =
        report.repository
          ?.repositoryName ||
        "sustainability-report";


      const safeName =
        repositoryName.replace(
          /[^a-zA-Z0-9-_]/g,
          "_"
        );


      link.download =
        `${safeName}.${report.reportType.toLowerCase()}`;


      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);


      // =====================================
      // Update download count in UI
      // =====================================

      setReports((prev) =>
        prev.map((item) => {

          if (item._id !== report._id) {
            return item;
          }

          return {
            ...item,
            downloadCount:
              (item.downloadCount || 0) + 1,
          };

        })
      );


    } catch (error) {

      console.error(
        "Download Report Error:",
        error
      );

    } finally {

      setDownloadLoading(null);

    }
  };


  // =====================================
  // Loading
  // =====================================

  if (loading) {

    return (

      <div className="p-6 text-gray-400">

        Loading Reports...

      </div>

    );
  }


  // =====================================
  // UI
  // =====================================

  return (

    <div className="p-6">


      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Reports
        </h1>

        <p className="text-gray-400 mt-2">
          Manage and download your sustainability reports.
        </p>

      </div>


      {/* Stats */}

      <ReportStats
        reports={reports}
      />


      {/* Search */}

      <div className="my-6">

        <ReportSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

      </div>


      {/* Filters */}

      <div className="mb-6">

        <ReportFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

      </div>


      {/* Table */}

      <ReportTable
        reports={filteredReports}

        onDelete={(id) => {

          setSelectedReportId(id);

          setDeleteModalOpen(true);

        }}

        onDownload={handleDownload}

        downloadLoading={downloadLoading}
      />


      {/* Delete Modal */}

      <DeleteReportModal

        isOpen={deleteModalOpen}

        onClose={() => {

          if (!deleteLoading) {

            setDeleteModalOpen(false);

            setSelectedReportId(null);

          }

        }}

        onConfirm={handleDelete}

        loading={deleteLoading}

      />

    </div>
  );
};


export default Reports;