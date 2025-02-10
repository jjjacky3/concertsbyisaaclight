import React from 'react';
import { X } from 'lucide-react';

const FilterModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Close filters"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        {/* Replace the placeholder below with your actual filter options */}
        <p className="text-gray-600 dark:text-gray-300">Filter options placeholder.</p>
      </div>
    </div>
  );
};

export default FilterModal;
