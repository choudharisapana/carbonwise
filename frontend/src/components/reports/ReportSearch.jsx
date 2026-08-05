import { FaSearch } from "react-icons/fa";
const ReportSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full">
      <FaSearch
  size={18}
  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
/>

      <input
        type="text"
        placeholder="Search reports..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full
          pl-12
          pr-4
          py-3
          border
          border-gray-300
          rounded-xl
          outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition
        "
      />
    </div>
  );
};

export default ReportSearch;