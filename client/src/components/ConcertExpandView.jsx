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


const ConcertExpandedView = ({ concert, closeOverlay, editWishList, wishList, favoriteClicked, handleRating }) => {
    const navigate = useNavigate();

    if (!concert) return null;
    // If No wishlist is passed just say concert is not in wishlist
    if (wishList == null) { wishList = [] }



    // Navigate to artist page
    const goToArtistPage = () => {
        const artistId = artistName.toLowerCase().replace(/\s+/g, '-');
        navigate(`/artist/${artistId}`);
        closeOverlay();
    };

    const isInWish = wishList.some(item => item.id === concert.id);
    const [localStar, setLocalStar] = useState(concert.review?.rating || 0);

    const wishListButtonClicked = () => {
        editWishList(isInWish ? "remove" : "add", concert);
    };

    useEffect(() => {
        setLocalStar(concert.review?.rating || 0);
    }, [concert]);

    const starLocalUpdate = (star) => {
        handleRating(concert.cid, star)
        setLocalStar(star)
    }

    const clicked = () => {
        clickItemFunc(concert)
    }

    const navigateToArtist = () => {
        const artistId = concert.artist.toLowerCase().replace(/\s+/g, '-');
        navigate(`/artist/${artistId}`);
        onClose();
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
            <div className="w-[700px] h-[600px] bg-gray-800 text-white rounded-xl shadow-2xl border border-gray-600/50 p-5 relative overflow-y-auto">
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 text-gray-300 hover:text-white"
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

                <p className="text-gray-400">{concertTour}</p>
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
                                className={`focus:outline-none transition-colors ${localStar >= star ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-400'
                                    }`}
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
                    <button className="px-4 py-2 bg-red-500 rounded-lg shadow-md hover:bg-yellow-400"
                    // onClick={favoriteClicked(concertID)}
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

                {/* Review Text Area - Only show if rated */}
                <div className="text-2xl font-bold pt-3">Reviews</div>
                {concert.review?.rating > 0 && (
                    <div className="mt-3">
                        <textarea
                            placeholder="Add your thoughts about this concert..."
                            value={concert.review?.text || ''}
                            onChange={(e) => handleReviewText(concert.cid, e.target.value)}
                            className="w-full bg-gray-800 text-white rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border"
                            rows="2"
                        />
                    </div>
                )}
            </div>
        </div>
    );

    // return (
    //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    //         <div className="w-[700px] h-[450px] bg-gray-800 text-white rounded-xl shadow-2xl border border-gray-600/50 p-5 relative">
    //             {/* Close Button */}
    //             <button
    //                 className="absolute top-3 right-3 text-gray-300 hover:text-white"
    //                 onClick={closeOverlay}
    //             >
    //                 <X size={24} />
    //             </button>

    //             {/* Concert Info */}
    //             <h2 className="text-2xl font-bold mb-2">{concertTitle}</h2>

    //             {/* Featured Artist Link - Make this more prominent */}
    //             <div
    //                 className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 cursor-pointer mb-2 
    //                 transform hover:scale-105 transition-transform p-1"
    //                 onClick={goToArtistPage}
    //             >
    //                 <User size={18} />
    //                 <span className="underline font-medium">Artist: {artistName}</span>
    //                 <ExternalLink size={14} />
    //             </div>

    //             <p className="text-gray-400">{concert.tour?.name}</p>

    //             <div className="flex items-center space-x-3 mt-2">
    //                 <Calendar size={18} />
    //                 <span>{concertDate}</span>
    //             </div>
    //             <div className="flex items-center space-x-3 mt-2">
    //                 <MapPin size={18} />
    //                 <span>{concertCity}</span>
    //             </div>
    //             <div className="flex items-center space-x-3 mt-2">
    //                 <Star size={18} />
    //                 <span>{concertRate} / 5</span>
    //             </div>
    //             <div className="flex items-center space-x-3 mt-2">
    //                 <Ticket size={18} />
    //                 <span>${concert.price}</span>
    //             </div>
    //             <p className="mt-4">{concertDes}</p>

    //             {/* Action Buttons - Prominent Artist View Button */}
    //             <div className="flex space-x-4 mt-6">
    //                 <button className="px-4 py-2 bg-yellow-500 rounded-lg shadow-md hover:bg-yellow-400">
    //                     <Heart size={18} className="inline-block mr-2" /> Favorite
    //                 </button>
    //                 <button className="px-4 py-2 bg-blue-600 rounded-lg shadow-md hover:bg-blue-500">
    //                     <Share2 size={18} className="inline-block mr-2" /> Share
    //                 </button>
    //                 {/* Make the artist button more prominent */}
    //                 <button
    //                     className="px-4 py-2 bg-purple-600 rounded-lg shadow-md hover:bg-purple-500 transform 
    //                     hover:scale-105 transition-transform flex-grow flex items-center justify-center"
    //                     onClick={goToArtistPage}
    //                 >
    //                     <User size={18} className="inline-block mr-2" />
    //                     View Artist Page
    //                     <ExternalLink size={16} className="ml-2" />
    //                 </button>
    //             </div>

    //             {/* Add an additional text hint */}
    //             <div className="text-center mt-3 text-gray-400 text-sm">
    //                 Click on artist name or button to view all concerts by this artist
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default ConcertExpandedView;