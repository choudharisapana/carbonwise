const filters = ["All", "PDF", "CSV"];

const ReportFilters = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-200
            ${
              activeFilter === filter
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default ReportFilters;