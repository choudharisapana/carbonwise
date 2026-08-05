import {
  FaFileAlt,
  FaFileCsv,
  FaDownload,
} from "react-icons/fa";

const ReportStats = ({ reports }) => {
  const totalReports = reports.length;

  const pdfReports = reports.filter(
    (report) => report.reportType === "PDF"
  ).length;

  const csvReports = reports.filter(
    (report) => report.reportType === "CSV"
  ).length;

  const totalDownloads = reports.reduce(
    (total, report) => total + (report.downloadCount || 0),
    0
  );

  const stats = [
  {
    title: "Total Reports",
    value: totalReports,
    icon: FaFileAlt,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "PDF Reports",
    value: pdfReports,
    icon: FaFileAlt,
    color: "bg-red-100 text-red-600",
  },
  {
    title: "CSV Reports",
    value: csvReports,
    icon: FaFileCsv,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Downloads",
    value: totalDownloads,
    icon: FaDownload,
    color: "bg-purple-100 text-purple-600",
  },
];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
  key={item.title}
  className="
    bg-dark-800/70
    backdrop-blur-xl
    border
    border-dark-700
    rounded-2xl
    p-6
    hover:border-primary-500/40
    hover:shadow-xl
    hover:shadow-primary-500/10
    transition-all
    duration-300
  "
>
            <div className="flex justify-between items-center">
              <div>
             <p className="text-sm text-gray-400 font-medium"/> 
<h2 className="text-5xl font-bold text-white mt-2">
                          {item.value}

                </h2>
               
              </div>
              

              <div
className={`
w-14
h-14
rounded-xl
flex
items-center
justify-center
${item.color}
shadow-lg
`}              >
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportStats;