import { FaTrash } from "react-icons/fa";

const DeleteReportModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">

            <FaTrash className="text-red-600" size={24} />

          </div>

          <div>

            <h2 className="text-xl font-semibold">
              Delete Report
            </h2>

            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>

          </div>

        </div>

        <p className="mt-6 text-gray-600">
          Are you sure you want to delete this report?
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteReportModal;