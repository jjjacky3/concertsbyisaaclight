import React from 'react';
import { Calendar, MapPin, Star, Ticket, Heart, Share2 } from 'lucide-react';

const ConcertCard = ({ concert, onClick }) => {
  // Format the date from ISO to display format
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle image source - could be base64, URL, or imported
  const getImageSrc = (image) => {
    if (!image) return '/api/placeholder/400/300';
    if (image.startsWith('data:image')) return image;
    return image;
  };

  return (
    <div
      onClick={() => onClick(concert)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
    >
      <div className="relative group">
        <img
          src={getImageSrc(concert.image)}
          alt={`${concert.artist} concert`}
          loading="lazy"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-4">
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Like"
            >
              <Heart className="w-6 h-6 text-red-500" />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Share"
            >
              <Share2 className="w-6 h-6 text-blue-500" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{concert.artist}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{concert.tourName}</p>
          </div>
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{concert.rating}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(concert.date)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{concert.venue}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {concert.tags && concert.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Ticket className="w-4 h-4 text-green-500" />
            <span className="font-medium text-green-500">${concert.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcertCard;