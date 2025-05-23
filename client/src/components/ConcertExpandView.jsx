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

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, MapPin, Star, StarOff, Ticket, Heart, Share2, X, User, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';


const ConcertExpandedView = ({ concert, closeOverlay, editWishList, wishList, favoriteClicked, handleRating, handleReviewText }) => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true';
    });

    if (!concert) return null;
    // If No wishlist is passed just say concert is not in wishlist
    if (wishList == null) { wishList = [] }

    // Navigate to artist page
    const goToArtistPage = () => {
        const artistId = concert.artist_name.toLowerCase().replace(/\s+/g, '-');
        navigate(`/artist/${artistId}`);
        closeOverlay();
    };

    const isInWish = wishList.some(item => item.cid === concert.cid);
    const [localStar, setLocalStar] = useState(concert.review?.rating || 0);
    const [reviewText, setReviewText] = useState(concert.review?.text || '');

    const wishListButtonClicked = () => {
        editWishList(isInWish ? "remove" : "add", concert);
    };

    useEffect(() => {
        setLocalStar(concert.review?.rating || 0);
        setReviewText(concert.review?.text || '');
    }, [concert]);

    const starLocalUpdate = (star) => {
        handleRating(concert.cid, star)
        setLocalStar(star)
    }

    const handleFavoriteClick = () => {
        if (favoriteClicked) {
            favoriteClicked(concert.cid);
        }
    };

    const handleReviewTextChange = (e) => {
        const newText = e.target.value;
        setReviewText(newText);
        if (handleReviewText) {
            handleReviewText(concert.cid, newText);
        }
    };

    const navigateToArtist = () => {
        const artistId = concert.artist_name.toLowerCase().replace(/\s+/g, '-');
        navigate(`/artist/${artistId}`);
        closeOverlay();
    };

    // Format the date using date-fns
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return format(new Date(dateStr), 'MMM d, yyyy');
    };

    // Format time to 12-hour format
    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    // Format price with proper currency
    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    let concertID = concert.cid
    let concertArtist = concert.artist_name
    let concertCity = concert.city
    let concertDate = formatDate(concert.date)
    let concertFavorate = concert.favorite
    let concertImg = concert.image_url
    let concertPrice = formatPrice(concert.price)
    let concertRating = concert.rating
    let concertReview = concert.review
    let concertReviewText = concert.review_text
    let concertTime = formatTime(concert.time)
    let concertTour = concert.tour_name
    let concertVenue = concert.venue_name

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`w-[700px] h-[600px] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-2xl border ${isDarkMode ? 'border-gray-600/50' : 'border-gray-200/50'} p-5 relative overflow-y-auto`}>
                {/* Close Button */}
                <button
                    className={`absolute top-3 right-3 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={closeOverlay}
                >
                    <X size={24} />
                </button>

                {/* Concert Info */}
                <h2 className="text-2xl font-bold mb-2">{concertArtist}</h2>

                {/* Add a prominent button to navigate to artist page */}
                <button
                    onClick={navigateToArtist}
                    className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center hover:bg-purple-700 transition-colors"
                >
                    <User className="w-4 h-4 mr-2" />
                    View Artist Page
                    <ExternalLink className="w-4 h-4 ml-2" />
                </button>

                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{concertTour}</p>
                <div className="flex items-center space-x-3 mt-2">
                    <Calendar size={18} />
                    <span>{concertDate}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                    <MapPin size={18} />
                    <span>{concertVenue}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                    {/* Rating Section */}
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => starLocalUpdate(star)}
                                className={`focus:outline-none transition-colors ${localStar >= star ? 'text-yellow-500' : isDarkMode ? 'text-gray-600 hover:text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                            >
                                <Star className="w-5 h-5" fill={localStar >= star ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                    <Ticket size={18} />
                    <span>{concertPrice}</span>
                </div>
                <p className="mt-4">DESCRIPTION</p>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-6">
                    <button 
                        className="px-4 py-2 bg-red-500 rounded-lg shadow-md hover:bg-yellow-400"
                        onClick={handleFavoriteClick}
                    >
                        {concertFavorate
                            ? <Heart size={18} className="text-red-400" fill="currentColor" />
                            : <Heart size={18} />}
                        Favorite
                    </button>
                    <button className="px-4 py-2 bg-blue-600 rounded-lg shadow-md hover:bg-blue-500">
                        <Share2 size={18} className="inline-block mr-2" /> Share
                    </button>
                    <button
                        className="px-4 py-2 bg-yellow-600 rounded-lg shadow-md hover:bg-blue-500 flex items-center gap-2"
                        onClick={wishListButtonClicked}
                    >
                        {isInWish
                            ? <Star size={18} className="text-yellow-400" fill="currentColor" />
                            : <Star size={18} />}
                        <span>Wish List</span>
                    </button>
                </div>

                {/* Review Text Area - Always show, not just when rated */}
                <div className="text-2xl font-bold pt-3">Reviews</div>
                <div className="mt-3">
                    <textarea
                        placeholder="Add your thoughts about this concert..."
                        value={reviewText}
                        onChange={handleReviewTextChange}
                        className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                </div>
            </div>
        </div>
    );
};

export default ConcertExpandedView;