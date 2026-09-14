import {
  FaLayerGroup,
  FaFileAlt,
  FaFileCsv
} from "react-icons/fa";


const filters = [
  {
    name: "All",
    icon: FaLayerGroup
  },
  {
    name: "PDF",
    icon: FaFileAlt
  },
  {
    name: "CSV",
    icon: FaFileCsv
  }
];


const ReportFilters = ({
  activeFilter,
  setActiveFilter
}) => {

  return (

    <div
      className="
        flex
        flex-wrap
        items-center
        gap-2
        sm:gap-3
      "
    >

      {filters.map((filter) => {

        const Icon = filter.icon;

        const isActive =
          activeFilter === filter.name;


        return (

          <button

            key={filter.name}

            onClick={() =>
              setActiveFilter(filter.name)
            }

            className={`
              flex
              items-center
              justify-center
              gap-2

              px-4
              sm:px-5

              py-2.5

              rounded-xl

              text-sm
              font-medium

              border

              transition-all
              duration-200

              ${
                isActive

                  ? `
                    bg-primary-500
                    text-white
                    border-primary-500
                    shadow-lg
                    shadow-primary-500/20
                  `

                  : `
                    bg-dark-800
                    text-dark-300
                    border-dark-700

                    hover:bg-dark-700
                    hover:text-white
                    hover:border-dark-600
                  `
              }

              active:scale-[0.97]
            `}
          >

            <Icon
              className="
                text-sm
              "
            />

            <span>

              {filter.name}

            </span>

          </button>

        );

      })}

    </div>

  );

};


export default ReportFilters;