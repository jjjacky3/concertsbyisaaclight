import { useState } from "react";
import { Calendar, MapPin, Star, Ticket, Heart, Share2 } from 'lucide-react';
import { stringify } from "flatted";
import { format } from 'date-fns';

const ConcertItem = ({ concert, onClick, isSelected, scale }) => {

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
    // let concertDate = formatDate(concert.date)
    let concertDate = concert.date
    let concertFavorate = concert.favorite
    let concertImg = concert.image_url
    let concertPrice = formatPrice(concert.price)
    let concertRating = concert.rating
    let concertReview = concert.review
    let concertReviewText = concert.review_text
    // let concertTime = formatTime(concert.time)
    let concertTime = concert.time
    let concertTour = concert.tour_name
    let concertVenue = concert.venue_name

    const handleDragStart = (e) => {
        e.dataTransfer.setData("concertData", stringify(concert));
        console.log(e)
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="w-[300px] h-[200px] bg-gray-700/70 text-white rounded-xl shadow-2xl border border-gray-600/50 p-5 mt-2 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] cursor-pointer"
            // className="w-[650px] h-[275px] bg-gray-700/70 text-white rounded-xl shadow-2xl border border-gray-600/50 p-5 mt-2 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] cursor-pointer"
            onClick={() => onClick(concert)}
            style={{ scale: `${scale}`, backgroundImage: `url(${concertImg})` }}
        >
            <div className="absolute inset-0 bg-black/30" />
            {/* Top Section: Artist Name + Rating */}
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{concertArtist}</h3>
                {/* ⭐ Fixed Rating Box - Positioned in the Top-Right
                <div className="absolute bottom-3 right-3 flex items-center space-x-2 bg-gray-700 px-5 py-3 rounded-lg text-lg shadow-md">
                    <Star className="w-6 h-6 text-yellow-500" />
                    <span className="font-semibold">{concertRating}</span>
                </div> */}
            </div>

            {/* Tour Name */}
            <p className="text-gray-400">{concertTour}</p>

            {/* Date & Location */}
            <div className="flex items-center space-x-4 text-gray-300 text-sm mt-2">
                <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{concertDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{concertCity}</span>
                </div>
            </div>


            {/* Description Section */}
            {/* <p className="text-sm text-gray-300 mt-3 break-words">{concertDes}</p> */}

            {/* Tags and Price Section */}
            <div className="flex justify-between items-center mt-4">
                {/*{/* Tags
                <div className="flex flex-wrap gap-2">
                    {concertTags && concertTags.map(tag => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                        >
                            {tag}
                        </span>
                    ))}
                </div>*/}

                {/* Price */}
                <div className="flex items-center space-x-2 absolute bottom-5 left-3">
                    <Ticket className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-green-500">{concertPrice}+</span>
                </div>
            </div>

        </div >
    )
}

export default ConcertItem