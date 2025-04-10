import { useState } from "react";
import { Calendar, MapPin, Star, Ticket, Heart, Share2 } from 'lucide-react';
import { stringify } from "flatted";

const WishListBubble = ({ concertdata, clickItemFunc, isSelected, scale, top, left }) => {
    console.log("WishlistBubble Loaded")



    if (concertdata == null) {
        return (
            <div className="w-[100px] h-[100px] left-[239px] top-[159px] absolute bg-gray-600 rounded-full text-black origin-center relative flex justify-center transform transition-transform duration-300 hover:scale-[1.5] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] cursor-pointer bg-center bg-contain"
                style={{ scale: `${scale}`, left: `${left}`, top: `${top}` }}>

            </div>
        )
    }

    let concertArtist = concertdata.artist
    let concertTour = concertdata.tourName
    let concertVenue = concertdata.venue
    let concertDate = concertdata.date
    let concertPrice = concertdata.price
    let concertRating = concertdata.rating
    let concertReviews = concertdata.reviews
    let concertImg = concertdata.image_url
    let concertTags = concertdata.tags

    const clicked = () => {
        clickItemFunc(concertdata)
    }

    return (
        <div className="w-[100px] h-[100px] left-[239px] top-[159px] absolute bg-white rounded-full text-black origin-center flex justify-center transform transition-transform duration-300 hover:scale-[1.5] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] cursor-pointer bg-center bg-contain"
            style={{ scale: `${scale}`, backgroundImage: `url(${concertImg})`, left: `${left}`, top: `${top}` }}
            onClick={clicked}>
            <div className="absolute flex items-center justify-center h-[40px] w-[80px] top-[20px]">
                <p className="p-1 text-[10px] font-bold text-center text-white leading-tight break-words whitespace-pre-wrap max-w-full max-h-full overflow-hidden">TITLE</p>
            </div>
            <div className="absolute flex items-center justify-center h-[20px] w-[80px] top-[55px]">
                <p className="p-1 text-[9px] font-style: italic text-center text-white leading-tight break-words whitespace-pre-wrap max-w-full max-h-full overflow-hidden">{concertArtist}</p>
            </div>
            <div className="absolute flex items-center justify-center h-[20px] w-[80px] top-[70px]">
                <p className="p-1 text-[9px] font-style: italic text-center text-white leading-tight break-words whitespace-pre-wrap max-w-full max-h-full overflow-hidden">{concertDate}</p>
            </div>
        </div >
    )
}

export default WishListBubble