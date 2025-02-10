import React from 'react';
import { X } from 'lucide-react';

const ConcertModal = ({ concert, onClose }) => {
  if (!concert) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">{concert.artist}</h2>
        <p className="mb-2">
          <strong>Tour:</strong> {concert.tourName}
        </p>
        <p className="mb-2">
          <strong>Venue:</strong> {concert.venue}
        </p>
        <p className="mb-2">
          <strong>Date:</strong> {concert.date}
        </p>
        <p className="mb-2">
          <strong>Price:</strong> {concert.price}
        </p>
        <p className="mb-2">
          <strong>Rating:</strong> {concert.rating} ({concert.reviews} reviews)
        </p>
        <div className="mt-4">
          <strong>Tags:</strong>
          <div className="flex space-x-2 mt-2">
            {concert.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcertModal;
