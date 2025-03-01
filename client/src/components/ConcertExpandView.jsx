import { useState } from "react";
import { Calendar, MapPin, Star, Ticket, Heart, Share2, X } from 'lucide-react';

const ConcertExpandedView = ({ concert, closeOverlay }) => {

    if (!concert) return null;

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
                <h2 className="text-2xl font-bold mb-2">{concert.name}</h2>
                <p className="text-gray-400">{concert.tour.name}</p>
                <div className="flex items-center space-x-3 mt-2">
                    <Calendar size={18} />
                    <span>{concert.date}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                    <MapPin size={18} />
                    <span>{concert.city}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                    <Star size={18} />
                    <span>{concert.rating} / 5</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                    <Ticket size={18} />
                    <span>${concert.price}</span>
                </div>
                <p className="mt-4">{concert.desc}</p>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-6">
                    <button className="px-4 py-2 bg-yellow-500 rounded-lg shadow-md hover:bg-yellow-400">
                        <Heart size={18} className="inline-block mr-2" /> Favorite
                    </button>
                    <button className="px-4 py-2 bg-blue-600 rounded-lg shadow-md hover:bg-blue-500">
                        <Share2 size={18} className="inline-block mr-2" /> Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConcertExpandedView;