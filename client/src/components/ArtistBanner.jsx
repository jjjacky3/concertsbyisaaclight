import React from 'react';
import { Music, Star } from 'lucide-react';

const ArtistBanner = ({ artist, selectedTour, changeTourFunc }) => {
    if (!artist) return null;

    let artistImage = artist.image || 'https://via.placeholder.com/1200x300';
    let artistRating = artist.avgRating ? artist.avgRating() : 'N/A';
    let artistName = artist.name;
    let goAgain = artist.goAgain ? `${artist.goAgain}%` : 'N/A';

    // Create a fallback background if image is missing or fails to load
    const handleImageError = (e) => {
        e.target.onerror = null;
        // Apply a gradient background instead
        e.target.closest('.artist-banner-container').style.backgroundImage = 
            'linear-gradient(to right, rgba(79, 70, 229, 0.8), rgba(124, 58, 237, 0.8))';
    };

    return (
        <div
            className="artist-banner-container relative w-full h-[300px] bg-cover bg-center text-white p-6 flex flex-col justify-between"
            style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(${artistImage})` }}
        >
            {/* Hidden image to check if the background image loads */}
            <img 
                src={artistImage} 
                onError={handleImageError} 
                className="hidden" 
                alt="" 
            />

            {/* Top Section: Rating Box + Artist Name */}
            <div className="flex items-center justify-between h-[120px] relative">
                {/* ⭐ Rating Box with fallback and tooltip */}
                <div className="group w-[100px] h-[100px] flex items-center justify-center text-center text-white text-5xl font-bold border-4 border-white rounded-2xl shadow-md ml-6 mt-5 backdrop-blur-sm bg-gray-800/30 relative">
                    <span>{artistRating}</span>
                    
                    {/* Tooltip showing rating info on hover */}
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-0 mb-2 w-[200px] bg-gray-900 p-3 rounded-lg text-sm shadow-xl pointer-events-none">
                        <p className="font-normal">Average rating from {Object.values(artist.ratings).reduce((a, b) => a + b, 0)} reviews</p>
                        <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span>Based on all concerts</span>
                        </div>
                    </div>
                </div>

                {/* 🎤 Artist Name */}
                <h1 className="absolute left-[150px] text-5xl font-bold mt-5 drop-shadow-lg">{artistName}</h1>
            </div>

            {/* Bottom Section: Go Again + Divider + Tour Selection */}
            <div className="absolute top-[150px] left-[30px] w-[500px] flex items-center justify-between">
                {/* 🎶 Would Go Again */}
                <div className="flex flex-col items-center text-center text-white text-3xl font-semibold backdrop-blur-sm bg-gray-800/30 p-3 rounded-lg">
                    <strong>{goAgain}</strong>
                    <span className="text-lg">Would Go Again</span>
                </div>

                {/* Vertical Divider */}
                <div className="border-l-2 border-white h-[100px]"></div>

                {/* 🔽 Tour Selection Dropdown */}
                <select
                    className="w-[250px] h-[50px] bg-white/20 backdrop-blur-sm text-white text-lg rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white shadow-md border border-white/20"
                    value={selectedTour}
                    onChange={changeTourFunc}
                >
                    <option value="All Tours">All Tours</option>
                    {artist.tours && artist.tours.map((tour, index) => (
                        <option key={index} value={tour.name}>{tour.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ArtistBanner;