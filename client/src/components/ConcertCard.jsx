/**
 * 
 * This component renders a responsive concert card displaying essential concert information in an
 * interactive format.
 * 
 * It also includes:
 * - Loading state handling with spinner during image load
 * - Fallback display for missing images
 * - Interactive hover effects with like and share buttons
 * - Formatted date, time and price displays
 * - Click navigation to both concert details and artist pages
 * - Responsive design with hover animations
 * 
 * The component handles image loading states and errors, formats dates using date-fns,
 * properly displays pricing information with currency formatting, and includes interactive elements
 * to navigate between different parts of the application. It features accessibility-focused button
 * implementations and smooth visual transitions through CSS.
 */


import React, { useState } from 'react';
import { Calendar, MapPin, Star, Ticket, Heart, Share2, Loader2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { stringify } from "flatted";


const ConcertCard = ({ concert, onClick, onFavoriteClick, onRatingClick }) => {
  console.log(concert);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'MMM d, yyyy');
  };

  
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getImageSrc = () => {
    if (concert.image_url) {
      return concert.image_url;
    }
    
    return '/placeholder-concert.jpg';
  };

  const navigateToArtist = (e) => {
    e.stopPropagation();
    const artistId = concert.artist.toLowerCase().replace(/\s+/g, '-');
    window.location.href = `/artist/${artistId}`;
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Favorite button clicked for concert:", concert.cid);
    console.log("Concert object:", concert);
    
    if (onFavoriteClick) {
      console.log("Calling onFavoriteClick with concert ID:", concert.cid);
      // Ensure concert.cid is a number if it's a string
      const concertId = typeof concert.cid === 'string' ? parseInt(concert.cid, 10) : concert.cid;
      onFavoriteClick(concertId);
    } else {
      console.error("onFavoriteClick prop is not defined");
    }
  };

  // Function to Enable Dragging Features
  const handleDragStart = (e) => {
    e.dataTransfer.setData("concertData", stringify(concert));
    console.log(e)
  };

  return (
    <div
      draggable
      onClick={() => onClick(concert)}
      onDragStart={handleDragStart}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
    >
      <div className="relative group">
        <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          )}
          <img
            src={getImageSrc()}
            alt={`${concert.artist} concert`}
            loading="lazy"
            className={`w-full h-48 object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
            onLoad={() => {
              setImageLoading(false);
              setImageError(false);
            }}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="text-4xl mb-2">🎵</div>
                <div className="text-sm">No Image Available {getImageSrc()}</div>
              </div>
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-4">
            <button
              onClick={handleFavoriteClick}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Like"
              type="button"
            >
              <Heart className={`w-6 h-6 ${concert.favorite ? 'text-red-500 fill-current' : 'text-red-500'}`} />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Share"
              type="button"
            >
              <Share2 className="w-6 h-6 text-blue-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3
              className="font-bold text-lg hover:text-blue-500 cursor-pointer"
              onClick={navigateToArtist}
            >
              {concert.artist}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{concert.tourName}</p>
          </div>
          <div className="flex items-center space-x-2">
            {concert.review?.rating > 0 && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="ml-1 text-sm">{concert.review.rating}/5</span>
              </div>
            )}
            {/* Always visible favorite button */}
            <button
              onClick={handleFavoriteClick}
              className="p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Like"
              type="button"
            >
              <Heart className={`w-5 h-5 ${concert.favorite ? 'text-red-500 fill-current' : 'text-red-500'}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(concert.date)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatTime(concert.time)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {concert.venue}, {concert.city}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Ticket className="w-4 h-4 text-green-500" />
            <span className="font-medium text-green-500">{formatPrice(concert.price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcertCard;