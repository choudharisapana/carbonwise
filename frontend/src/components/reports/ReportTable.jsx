import { useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaTrash,
  FaEye,
  FaFileAlt,
  FaFileCsv,
} from "react-icons/fa";

const ReportTable = ({ reports, onDelete, onDownload }) => {
  const navigate = useNavigate();
  if (!reports.length) {
    return (
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-semibold text-white">
          No Reports Found
        </h2>

        <p className="text-dark-400 mt-3">
          Generate your first sustainability report to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-dark-900 border-b border-dark-700">

            <tr className="text-dark-300 text-sm uppercase tracking-wider">

              <th className="px-6 py-4 text-left">
                Report
              </th>

              <th className="px-6 py-4 text-left">
                Repository
              </th>

              <th className="px-6 py-4 text-center">
                Type
              </th>

              <th className="px-6 py-4 text-center">
                Carbon Score
              </th>

              <th className="px-6 py-4 text-center">
                Generated
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {reports.map((report) => (

              <tr
                key={report._id}
                className="border-b border-dark-700 hover:bg-dark-700/40 transition"
              >

                <td className="px-6 py-5 text-white font-semibold">

                  {report.reportName}

                </td>

                <td className="px-6 py-5 text-dark-300">

                  {report.repository?.repositoryName || "-"}

                </td>

                <td className="px-6 py-5 text-center">

                  {report.reportType === "PDF" ? (

                    <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">

                      <FaFileAlt size={14} />

                      PDF

                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">

                      <FaFileCsv size={14} />

                      CSV

                    </span>

                  )}

                </td>

                <td className="px-6 py-5 text-center text-white font-semibold">

                  {report.carbonScore}

                </td>

                <td className="px-6 py-5 text-center text-dark-300">

                  {new Date(report.generatedAt).toLocaleDateString()}

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-3">

                   <button
    onClick={() => navigate(`/reports/${report._id}`)}
    className="w-10 h-10 rounded-lg bg-dark-700 hover:bg-blue-500 text-dark-300 hover:text-white transition flex items-center justify-center"
>
    <FaEye />
</button>

                    <button
                      onClick={() => onDownload(report)}
                      className="w-10 h-10 rounded-lg bg-dark-700 hover:bg-green-500 text-dark-300 hover:text-white transition flex items-center justify-center"
                    >
                      <FaDownload />
                    </button>

                    <button
                      onClick={() => onDelete(report._id)}
                      className="w-10 h-10 rounded-lg bg-dark-700 hover:bg-red-500 text-dark-300 hover:text-white transition flex items-center justify-center"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ReportTable;