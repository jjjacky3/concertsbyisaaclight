import { useState } from "react";
import { Calendar, MapPin, Star, Ticket, Heart, Share2 } from 'lucide-react';

const ConcertExpandedView = ({ concert, clickItemFunc, isSelected }) => {

    let concertTitle = concert.name
    let concertCity = concert.city
    let concertDate = concert.date
    let concertDes = concert.desc
    let concertRate = concert.rating
    let concertPrice = "$" + concert.price
    let concertTour = concert.tour

    const clicked = () => {
        clickItemFunc(concert)
    }

    return (
        <div
            className="w-[700px] h-[400px] bg-gray-700/70 text-white rounded-xl shadow-2xl border border-gray-600/50 p-5 mt-2 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] cursor-pointer">
            Test
        </div>
    )
}

export default ConcertExpandedView