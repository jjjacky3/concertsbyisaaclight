/**
 * 
 * This component renders a compact, interactive concert card displaying essential event information
 * in a visually appealing format.
 * 
 * It also includes:
 * - A prominent concert title with tour name displayed beneath it
 * - Date and location information with intuitive icon indicators
 * - A rating display in the bottom-right corner with star visualization
 * - Ticket pricing information in the bottom-left with ticket icon
 * - Hover effects for improved user interaction feedback
 * - Drag-and-drop functionality allowing the concert data to be transferred
 * 
 * The component handles formatting of price values (adding $ prefix), manages click events to
 * trigger the parent component's handler, and implements drag start events that serialize
 * the concert data. The design uses a space-efficient card layout that scales slightly on hover
 * to provide visual feedback for interactive elements.
 */

import { useState } from "react";
import { Calendar, MapPin, Star, Ticket, Heart, Share2 } from 'lucide-react';
import { stringify } from "flatted";

const ConcertItem = ({ concert, clickItemFunc, isSelected }) => {

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
            onClick={clicked}
        >
            {/* Top Section: Artist Name + Rating */}
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{concertTitle}</h3>
                {/* ⭐ Fixed Rating Box - Positioned in the Top-Right */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-2 bg-gray-700 px-5 py-3 rounded-lg text-lg shadow-md">
                    <Star className="w-6 h-6 text-yellow-500" />
                    <span className="font-semibold">{concertRate}</span>
                </div>
            </div>

            {/* Tour Name */}
            <p className="text-gray-400">{concertTour.name}</p>

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