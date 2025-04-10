import { useState } from "react";
import { Calendar, MapPin, Star, Ticket, Heart, Share2 } from 'lucide-react';
import { stringify } from "flatted";
import { format } from 'date-fns';

const WishListBubble = ({ concertdata, clickItemFunc, isSelected, scale, top, left }) => {
    console.log("WishlistBubble Loaded")



    if (concertdata == null) {
        return (
            <div className="w-[100px] h-[100px] left-[239px] top-[159px] absolute bg-gray-600 rounded-full text-black origin-center relative flex justify-center transform transition-transform duration-300 hover:scale-[1.5] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] cursor-pointer bg-center bg-contain"
                style={{ scale: `${scale}`, left: `${left}`, top: `${top}` }}>

            </div>
        )
    }

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

    let concertID = concertdata.cid
    let concertArtist = concertdata.artist_name
    let concertCity = concertdata.city
    let concertDate = formatDate(concertdata.date)
    let concertFavorate = concertdata.favorate
    let concertImg = concertdata.image_url
    let concertPrice = formatPrice(concertdata.price)
    let concertRating = concertdata.rating
    let concertReview = concertdata.review
    let concertReviewText = concertdata.review_text
    let concertTime = formatTime(concertdata.time)
    let concertTour = concertdata.tour_name
    let concertVenue = concertdata.venue_name

    const clicked = () => {
        clickItemFunc(concertdata)
    }

    return (
        <div className="w-[100px] h-[100px] left-[239px] top-[159px] absolute bg-white rounded-full text-black origin-center flex justify-center transform transition-transform duration-300 hover:scale-[1.5] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] cursor-pointer bg-center bg-contain"
            style={{ scale: `${scale}`, backgroundImage: `url(${concertImg})`, left: `${left}`, top: `${top}` }}
            onClick={clicked}>
            <div className="absolute flex items-center justify-center h-[40px] w-[80px] top-[20px]">
                <p className="p-1 text-[10px] font-bold text-center text-white leading-tight break-words whitespace-pre-wrap max-w-full max-h-full overflow-hidden">{concertArtist}</p>
            </div>
            <div className="absolute flex items-center justify-center h-[20px] w-[80px] top-[55px]">
                <p className="p-1 text-[9px] font-style: italic text-center text-white leading-tight break-words whitespace-pre-wrap max-w-full max-h-full overflow-hidden">{concertVenue}</p>
            </div>
            <div className="absolute flex items-center justify-center h-[20px] w-[80px] top-[70px]">
                <p className="p-1 text-[9px] font-style: italic text-center text-white leading-tight break-words whitespace-pre-wrap max-w-full max-h-full overflow-hidden">{concertDate}</p>
            </div>
        </div >
    )
}

export default WishListBubble