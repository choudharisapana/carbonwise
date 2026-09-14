import {
  FaFileAlt,
  FaFileCsv,
  FaDownload,
  FaChartLine,
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
    (total, report) =>
      total + (report.downloadCount || 0),
    0
  );


  const stats = [
    {
      title: "TOTAL REPORTS",
      value: totalReports,
      icon: FaFileAlt,
      iconBg: "bg-primary-500/10",
      iconColor: "text-primary-400",
      bar: "bg-primary-500",
    },

    {
      title: "PDF REPORTS",
      value: pdfReports,
      icon: FaFileAlt,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      bar: "bg-red-500",
    },

    {
      title: "CSV REPORTS",
      value: csvReports,
      icon: FaFileCsv,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      bar: "bg-emerald-500",
    },

    {
      title: "TOTAL DOWNLOADS",
      value: totalDownloads,
      icon: FaDownload,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      bar: "bg-purple-500",
    },
  ];


  return (

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-4
        lg:gap-5
      "
    >

      {stats.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.title}
            className="
              relative
              overflow-hidden
              bg-dark-800
              border
              border-dark-700
              rounded-2xl
              p-5
              sm:p-6
              transition-all
              duration-300
              hover:border-primary-500/40
              hover:-translate-y-1
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >

              <div>

                <p
                  className="
                    text-[11px]
                    sm:text-xs
                    tracking-[0.18em]
                    text-dark-400
                    font-medium
                  "
                >
                  {item.title}
                </p>


                <h2
                  className="
                    text-4xl
                    font-bold
                    text-white
                    mt-3
                  "
                >
                  {item.value}
                </h2>

              </div>


              <div
                className={`
                  w-12
                  h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${item.iconBg}
                  ${item.iconColor}
                `}
              >

                <Icon className="text-xl" />

              </div>

            </div>


            {/* Progress Bar */}

            <div
              className="
                mt-6
                w-full
                h-2
                rounded-full
                bg-dark-700
                overflow-hidden
              "
            >

              <div
                className={`
                  h-full
                  rounded-full
                  ${item.bar}
                `}
                style={{
                  width:
                    totalReports === 0
                      ? "0%"
                      : "100%",
                }}
              />

            </div>

          </div>

        );

      })}

    </div>

  );

};


export default ReportStats;