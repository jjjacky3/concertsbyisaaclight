/**
 * 
 * This component renders a focused modal overlay that displays detailed concert information in a clean,
 * accessible format centered on the screen.
 * 
 * It also includes:
 * - A prominent artist name header for immediate context
 * - A highlighted call-to-action button for viewing the complete artist profile
 * - Structured information fields for tour name, venue, date, price, and rating
 * - Review count display providing social proof alongside the rating
 * - Conditional rendering of categorization tags when available
 * - A close button allowing users to dismiss the modal easily
 * 
 * The component handles navigation to artist pages by formatting artist names into URL-friendly slugs.
 * It supports both light and dark mode through appropriate Tailwind classes, performs conditional rendering
 * if concert data is missing, and automatically closes the modal after navigation to maintain a smooth
 * user experience flow.
 */


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, ExternalLink } from 'lucide-react';

const ConcertModal = ({ concert, onClose }) => {
  const navigate = useNavigate();
  
  if (!concert) return null;
  
  // Function to navigate to artist page
  const navigateToArtist = () => {
    const artistId = concert.artist.toLowerCase().replace(/\s+/g, '-');
    navigate(`/artist/${artistId}`);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-lg relative text-gray-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">{concert.artist}</h2>
        
        {/* Add a prominent button to navigate to artist page */}
        <button
          onClick={navigateToArtist}
          className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center hover:bg-purple-700 transition-colors"
        >
          <User className="w-4 h-4 mr-2" />
          View Artist Page
          <ExternalLink className="w-4 h-4 ml-2" />
        </button>
        
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
          <strong>Rating:</strong> {concert.rating} ({concert.reviews || 0} reviews)
        </p>
        
        {concert.tags && concert.tags.length > 0 && (
          <div className="mt-4">
            <strong>Tags:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
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
        )}
      </div>
    </div>
  );
};

export default ConcertModal;