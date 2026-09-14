import { FaSearch, FaTimes } from "react-icons/fa";

const ReportSearch = ({
  searchTerm,
  setSearchTerm
}) => {

  return (

    <div className="relative w-full">

      {/* Search Icon */}

      <FaSearch
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-dark-400
          text-sm
          pointer-events-none
        "
      />


      {/* Input */}

      <input
        type="text"

        placeholder="
          Search by report or repository name...
        "

        value={searchTerm}

        onChange={(e) =>
          setSearchTerm(e.target.value)
        }

        className="
          w-full

          bg-dark-800

          border
          border-dark-700

          rounded-xl

          py-3
          sm:py-3.5

          pl-11
          pr-11

          text-sm
          sm:text-base

          text-white

          placeholder:text-dark-500

          outline-none

          transition-all
          duration-200

          focus:border-primary-500/70

          focus:ring-4
          focus:ring-primary-500/10

          hover:border-dark-600
        "
      />


      {/* Clear Button */}

      {searchTerm && (

        <button

          onClick={() =>
            setSearchTerm("")
          }

          className="
            absolute

            right-3

            top-1/2

            -translate-y-1/2

            w-8
            h-8

            flex
            items-center
            justify-center

            rounded-lg

            text-dark-400

            hover:text-white

            hover:bg-dark-700

            transition
          "

          title="Clear search"
        >

          <FaTimes
            size={14}
          />

        </button>

      )}

    </div>

  );

};


export default ReportSearch;