import { useNavigate } from "react-router-dom";

import {
  FaDownload,
  FaTrash,
  FaEye,
  FaFileAlt,
  FaFileCsv,
  FaFolderOpen,
  FaChartLine,
  FaFile,
} from "react-icons/fa";


const ReportTable = ({
  reports,
  onDelete,
  onDownload,
  downloadLoading,
}) => {

  const navigate = useNavigate();


  // =====================================
  // EMPTY STATE
  // =====================================

  if (!reports.length) {

    return (

      <div
        className="
          relative
          overflow-hidden
          bg-dark-800
          border
          border-dark-700
          rounded-2xl
          min-h-[380px]
          flex
          items-center
          justify-center
          p-6
          sm:p-10
        "
      >

        {/* Background Glow */}

        <div
          className="
            absolute
            w-72
            h-72
            bg-primary-500/5
            rounded-full
            blur-3xl
            pointer-events-none
          "
        />


        <div
          className="
            relative
            z-10
            text-center
            max-w-md
          "
        >

          {/* Icon */}

          <div
            className="
              mx-auto
              w-20
              h-20
              sm:w-24
              sm:h-24
              rounded-2xl
              bg-primary-500/10
              border
              border-primary-500/20
              flex
              items-center
              justify-center
              mb-6
            "
          >

            <FaFolderOpen
              className="
                text-3xl
                sm:text-4xl
                text-primary-400
              "
            />

          </div>


          <h2
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-white
            "
          >

            No Reports Yet

          </h2>


          <p
            className="
              text-sm
              sm:text-base
              text-dark-400
              mt-3
              leading-relaxed
            "
          >

            You haven't generated any sustainability
            reports yet. Analyze a repository and create
            your first report to start tracking your
            carbon impact.

          </p>


          <button
            onClick={() => navigate("/repository")}
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-primary-500
              hover:bg-primary-600
              text-white
              font-semibold
              transition
              shadow-lg
              shadow-primary-500/20
            "
          >

            <FaChartLine />

            Analyze Repository

          </button>


        </div>

      </div>

    );

  }


  // =====================================
  // TYPE BADGE
  // =====================================

  const TypeBadge = ({ type }) => {

    const isPDF =
      type === "PDF";


    return (

      <span
        className={`
          inline-flex
          items-center
          justify-center
          gap-2
          px-3
          py-1.5
          rounded-full
          text-xs
          font-semibold

          ${
            isPDF
              ? "bg-red-500/15 text-red-400"
              : "bg-emerald-500/15 text-emerald-400"
          }
        `}
      >

        {isPDF ? (

          <FaFileAlt />

        ) : (

          <FaFileCsv />

        )}

        {type}

      </span>

    );

  };


  // =====================================
  // ACTION BUTTON
  // =====================================

  const ActionButton = ({
    children,
    onClick,
    disabled,
    variant = "default",
    title,
  }) => {

    const variants = {

      default:
        `
          bg-dark-700
          hover:bg-primary-500
          text-dark-300
          hover:text-white
        `,

      download:
        `
          bg-dark-700
          hover:bg-emerald-500
          text-dark-300
          hover:text-white
        `,

      delete:
        `
          bg-dark-700
          hover:bg-red-500
          text-dark-300
          hover:text-white
        `,

    };


    return (

      <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`
          w-10
          h-10
          rounded-xl
          flex
          items-center
          justify-center
          transition-all
          duration-200
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${variants[variant]}
        `}
      >

        {children}

      </button>

    );

  };


  return (

    <>

      {/* =====================================
          DESKTOP TABLE
      ===================================== */}

      <div
        className="
          hidden
          lg:block
          bg-dark-800
          border
          border-dark-700
          rounded-2xl
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full">

            {/* HEADER */}

            <thead
              className="
                bg-dark-900
                border-b
                border-dark-700
              "
            >

              <tr
                className="
                  text-dark-300
                  text-xs
                  uppercase
                  tracking-wider
                "
              >

                <th className="px-6 py-5 text-left">

                  Report

                </th>

                <th className="px-6 py-5 text-left">

                  Repository

                </th>

                <th className="px-6 py-5 text-center">

                  Type

                </th>

                <th className="px-6 py-5 text-center">

                  Carbon Score

                </th>

                <th className="px-6 py-5 text-center">

                  Generated

                </th>

                <th className="px-6 py-5 text-center">

                  Actions

                </th>

              </tr>

            </thead>


            {/* BODY */}

            <tbody>

              {reports.map((report) => (

                <tr
                  key={report._id}
                  className="
                    border-b
                    border-dark-700
                    last:border-0
                    hover:bg-dark-700/30
                    transition
                  "
                >

                  {/* REPORT */}

                  <td className="px-6 py-6">

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-primary-500/10
                          text-primary-400
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <FaFile />

                      </div>


                      <p
                        className="
                          text-white
                          font-semibold
                          max-w-[260px]
                          truncate
                        "
                      >

                        {report.reportName}

                      </p>

                    </div>

                  </td>


                  {/* REPOSITORY */}

                  <td
                    className="
                      px-6
                      py-6
                      text-dark-300
                      font-medium
                    "
                  >

                    {report.repository?.repositoryName || "-"}

                  </td>


                  {/* TYPE */}

                  <td
                    className="
                      px-6
                      py-6
                      text-center
                    "
                  >

                    <TypeBadge
                      type={report.reportType}
                    />

                  </td>


                  {/* CARBON SCORE */}

                  <td
                    className="
                      px-6
                      py-6
                      text-center
                    "
                  >

                    <span
                      className="
                        text-white
                        font-bold
                      "
                    >

                      {report.carbonScore ?? "-"}

                    </span>

                  </td>


                  {/* DATE */}

                  <td
                    className="
                      px-6
                      py-6
                      text-center
                      text-dark-300
                    "
                  >

                    {report.generatedAt
                      ? new Date(
                          report.generatedAt
                        ).toLocaleDateString()
                      : "-"
                    }

                  </td>


                  {/* ACTIONS */}

                  <td className="px-6 py-6">

                    <div
                      className="
                        flex
                        justify-center
                        gap-3
                      "
                    >

                      {/* VIEW */}

                      <ActionButton
                        title="View Report"
                        onClick={() =>
                          navigate(
                            `/reports/${report._id}`
                          )
                        }
                      >

                        <FaEye />

                      </ActionButton>


                      {/* DOWNLOAD */}

                      <ActionButton
                        title="Download Report"
                        variant="download"
                        disabled={
                          downloadLoading ===
                          report._id
                        }
                        onClick={() =>
                          onDownload(report)
                        }
                      >

                        {downloadLoading ===
                        report._id ? (

                          <span
                            className="
                              w-4
                              h-4
                              border-2
                              border-white
                              border-t-transparent
                              rounded-full
                              animate-spin
                            "
                          />

                        ) : (

                          <FaDownload />

                        )}

                      </ActionButton>


                      {/* DELETE */}

                      <ActionButton
                        title="Delete Report"
                        variant="delete"
                        onClick={() =>
                          onDelete(report._id)
                        }
                      >

                        <FaTrash />

                      </ActionButton>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================
          MOBILE + TABLET CARDS
      ===================================== */}

      <div
        className="
          lg:hidden
          space-y-4
        "
      >

        {reports.map((report) => (

          <div
            key={report._id}
            className="
              bg-dark-800
              border
              border-dark-700
              rounded-2xl
              p-4
              sm:p-5
              transition
              hover:border-primary-500/30
            "
          >

            {/* TOP */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  min-w-0
                "
              >

                <div
                  className="
                    flex-shrink-0
                    w-11
                    h-11
                    rounded-xl
                    bg-primary-500/10
                    text-primary-400
                    flex
                    items-center
                    justify-center
                  "
                >

                  <FaFileAlt />

                </div>


                <div className="min-w-0">

                  <h3
                    className="
                      text-white
                      font-semibold
                      truncate
                    "
                  >

                    {report.reportName}

                  </h3>


                  <p
                    className="
                      text-sm
                      text-dark-400
                      mt-1
                      truncate
                    "
                  >

                    {report.repository?.repositoryName || "-"}

                  </p>

                </div>

              </div>


              <TypeBadge
                type={report.reportType}
              />

            </div>


            {/* INFO */}

            <div
              className="
                grid
                grid-cols-2
                gap-4
                mt-5
                pt-5
                border-t
                border-dark-700
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    text-dark-500
                    uppercase
                    tracking-wider
                  "
                >

                  Carbon Score

                </p>

                <p
                  className="
                    text-white
                    font-bold
                    mt-1
                  "
                >

                  {report.carbonScore ?? "-"}

                </p>

              </div>


              <div>

                <p
                  className="
                    text-xs
                    text-dark-500
                    uppercase
                    tracking-wider
                  "
                >

                  Generated

                </p>

                <p
                  className="
                    text-dark-300
                    text-sm
                    mt-1
                  "
                >

                  {report.generatedAt
                    ? new Date(
                        report.generatedAt
                      ).toLocaleDateString()
                    : "-"
                  }

                </p>

              </div>

            </div>


            {/* ACTIONS */}

            <div
              className="
                flex
                gap-3
                mt-5
              "
            >

              <button
                onClick={() =>
                  navigate(
                    `/reports/${report._id}`
                  )
                }
                className="
                  flex-1
                  h-11
                  rounded-xl
                  bg-dark-700
                  hover:bg-primary-500
                  text-dark-300
                  hover:text-white
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                "
              >

                <FaEye />

                View

              </button>


              <button
                onClick={() =>
                  onDownload(report)
                }
                disabled={
                  downloadLoading ===
                  report._id
                }
                className="
                  flex-1
                  h-11
                  rounded-xl
                  bg-primary-500
                  hover:bg-primary-600
                  text-white
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                  disabled:opacity-50
                "
              >

                {downloadLoading ===
                report._id ? (

                  <span
                    className="
                      w-4
                      h-4
                      border-2
                      border-white
                      border-t-transparent
                      rounded-full
                      animate-spin
                    "
                  />

                ) : (

                  <>
                    <FaDownload />

                    Download
                  </>

                )}

              </button>


              <button
                onClick={() =>
                  onDelete(report._id)
                }
                className="
                  w-11
                  h-11
                  flex-shrink-0
                  rounded-xl
                  bg-red-500/10
                  hover:bg-red-500
                  text-red-400
                  hover:text-white
                  flex
                  items-center
                  justify-center
                  transition
                "
              >

                <FaTrash />

              </button>

            </div>

          </div>

        ))}

      </div>

    </>

  );

};


export default ReportTable;