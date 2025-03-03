import React, { useContext } from 'react';
import { Calendar, MapPin, Star, Ticket, Heart, Share2 } from 'lucide-react';
import { NavigationContext } from '../App'; // Import the navigation context
import Artist from '../../../server/models/Artist';
import Tour from '../../../server/models/Tour';

const ConcertCard = ({ concert, onClick }) => {
  // Access the navigation context
  const { navigateToArtistPage } = useContext(NavigationContext);
  
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

  // Handle card click - either show details or navigate to artist page based on the click type
  const handleCardClick = (e) => {
    if (e.target.closest('.artist-link')) {
      // If clicking on the artist name, navigate to artist page
      e.stopPropagation();
      
      // Create a new Artist instance for the clicked artist if it's not AlecBenjamin
      if (concert.artist !== 'Alec Benjamin') {
        // Create a default artist with minimal data
        const newArtist = new Artist(
          concert.artist,
          { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, // Empty ratings
          "https://source.unsplash.com/random/1200x400/?concert", // Default image
          0 // Default go-again percentage
        );
        
        // Create a default tour
        const defaultTour = new Tour(newArtist, "Upcoming Shows");
        
        // Navigate to the artist page with this artist
        navigateToArtistPage(newArtist);
      } else {
        // For Alec Benjamin, just navigate to the artist page with default artist
        navigateToArtistPage();
      }
    } else {
      // For clicks elsewhere on the card, show the concert details modal
      onClick(concert);
    }
  };

  // Handle direct navigation to artist page
  const navigateToArtist = (e) => {
    e.stopPropagation();
    
    // Similar logic to above, but in a separate function for the direct click
    if (concert.artist !== 'Alec Benjamin') {
      const newArtist = new Artist(
        concert.artist,
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        "https://source.unsplash.com/random/1200x400/?concert",
        0
      );
      
      const defaultTour = new Tour(newArtist, "Upcoming Shows");
      navigateToArtistPage(newArtist);
    } else {
      navigateToArtistPage();
    }
  };

  return (
    <div
      onClick={handleCardClick}
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
            <h3 
              className="font-bold text-lg artist-link hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer"
              onClick={navigateToArtist}
            >
              {concert.artist}
            </h3>
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