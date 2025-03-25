import { useState } from "react";
import { Calendar, MapPin, Star, Ticket, Heart, Share2 } from 'lucide-react';
import { stringify } from "flatted";

const WishListBubble = ({ concertdata, clickItemFunc, isSelected, scale, top, left }) => {
    console.log("WishlistBubble Loaded")
    console.log(concertdata)
    console.log("Concert Rating:")
    console.log(concertdata[13])

    if (concertdata == null) {
        return (
            <div className="w-[100px] h-[100px] left-[239px] top-[159px] absolute bg-gray-600 rounded-full text-black origin-center relative flex justify-center transform transition-transform duration-300 hover:scale-[1.5] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] cursor-pointer bg-center bg-contain"
                style={{ scale: `${scale}`, left: `${left}`, top: `${top}` }}>

            </div>
        )
    }

    let concertArtist = concertdata[1]
    let concertTitle = concertdata[2]
    let concertCity = concertdata[4]
    let concertDate = concertdata[3]
    let concertDes = concertdata[5]
    let concertRate = concertdata[13]
    let concertPrice = "$" + concertdata.price
    let concertTour = concertdata.tour
    let concertImage = concertdata[8]

    const clicked = () => {

    }

    return (
        <div className="w-[100px] h-[100px] left-[239px] top-[159px] absolute bg-white rounded-full text-black origin-center flex justify-center transform transition-transform duration-300 hover:scale-[1.5] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] cursor-pointer bg-center bg-contain"
            style={{ scale: `${scale}`, backgroundImage: `url(${concertImage})`, left: `${left}`, top: `${top}` }}>
            <div className="absolute flex items-center justify-center h-[40px] w-[80px] top-[20px]">
                <p className="p-1 text-[10px] font-bold text-center text-white leading-tight break-words whitespace-pre-wrap max-w-full max-h-full overflow-hidden">{concertTitle || "Failed"}</p>
            </div>
            <div className="absolute flex items-center justify-center h-[20px] w-[80px] top-[60px]">
                <p className="p-1 text-[9px] font-style: italic text-center text-white leading-tight break-words whitespace-pre-wrap max-w-full max-h-full overflow-hidden">{concertArtist}</p>
            </div>
        </div >
    )
}

export default WishListBubble