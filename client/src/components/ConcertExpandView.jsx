/**
 * 
 * This component renders a detailed modal overlay for a selected concert with comprehensive event information.
 * 
 * It includes:
 * - A concert title and artist information with navigation links to the artist page
 * - Tour name identification for context about the broader performance series
 * - Key event details with intuitive icons (date, location, rating, and ticket price)
 * - A full concert description providing additional context about the event
 * - Interactive action buttons for favoriting and sharing the concert
 * - Multiple navigation paths to the related artist page with visual indicators
 * 
 * The component handles conditional rendering if concert data is missing, properly formats
 * all display values, and provides multiple user interaction points to navigate to the artist
 * page. The close button allows users to exit the modal overlay and return to the previous view.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Star, Ticket, Heart, Share2, X, User, ExternalLink } from 'lucide-react';

const ConcertExpandedView = ({ concert, closeOverlay }) => {
    const navigate = useNavigate();
    
    if (!concert) return null;

    let concertTitle = concert.name;
    let concertCity = concert.city;
    let concertDate = concert.date;
    let concertDes = concert.desc;
    let concertRate = concert.rating;
    let concertPrice = "$" + concert.price;
    let concertTour = concert.tour;
    let artistName = concert.artist || 'Unknown Artist';

    // Navigate to artist page
    const goToArtistPage = () => {
        const artistId = artistName.toLowerCase().replace(/\s+/g, '-');
        navigate(`/artist/${artistId}`);
        closeOverlay();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-[700px] h-[450px] bg-gray-800 text-white rounded-xl shadow-2xl border border-gray-600/50 p-5 relative">
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 text-gray-300 hover:text-white"
                    onClick={closeOverlay}
                >
                    <X size={24} />
                </button>

                {/* Concert Info */}
                <h2 className="text-2xl font-bold mb-2">{concertTitle}</h2>
                
                {/* Featured Artist Link - Make this more prominent */}
                <div 
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 cursor-pointer mb-2 
                    transform hover:scale-105 transition-transform p-1"
                    onClick={goToArtistPage}
                >
                    <User size={18} />
                    <span className="underline font-medium">Artist: {artistName}</span>
                    <ExternalLink size={14} />
                </div>
                
                <p className="text-gray-400">{concert.tour?.name}</p>
                
                <div className="flex items-center space-x-3 mt-2">
                    <Calendar size={18} />
                    <span>{concertDate}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                    <MapPin size={18} />
                    <span>{concertCity}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                    <Star size={18} />
                    <span>{concertRate} / 5</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                    <Ticket size={18} />
                    <span>${concert.price}</span>
                </div>
                <p className="mt-4">{concertDes}</p>

                {/* Action Buttons - Prominent Artist View Button */}
                <div className="flex space-x-4 mt-6">
                    <button className="px-4 py-2 bg-yellow-500 rounded-lg shadow-md hover:bg-yellow-400">
                        <Heart size={18} className="inline-block mr-2" /> Favorite
                    </button>
                    <button className="px-4 py-2 bg-blue-600 rounded-lg shadow-md hover:bg-blue-500">
                        <Share2 size={18} className="inline-block mr-2" /> Share
                    </button>
                    {/* Make the artist button more prominent */}
                    <button 
                        className="px-4 py-2 bg-purple-600 rounded-lg shadow-md hover:bg-purple-500 transform 
                        hover:scale-105 transition-transform flex-grow flex items-center justify-center"
                        onClick={goToArtistPage}
                    >
                        <User size={18} className="inline-block mr-2" /> 
                        View Artist Page
                        <ExternalLink size={16} className="ml-2" />
                    </button>
                </div>
                
                {/* Add an additional text hint */}
                <div className="text-center mt-3 text-gray-400 text-sm">
                    Click on artist name or button to view all concerts by this artist
                </div>
            </div>
        </div>
    );
};

export default ConcertExpandedView;