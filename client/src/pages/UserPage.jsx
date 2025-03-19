import ArtistBanner from "../components/ArtistBanner"
import Artist from "../../../server/models/Artist"
import Tour from "../../../server/models/Tour"
import Concert from "../../../server/models/DamienConcert"
import React, { useState, useEffect } from "react";
import NavBar from '../components/NavBar'
import ConcertItem from "../components/ConcertItem";
import RatingModule from "../components/RatingModule";
import CompareModule from "../components/CompareModule";

const UserPage = ({ artist }) => {

    const concertList = artist.concerts
    const [wishList, setWishList] = useState([])

    const handleDragOver = (e) => {
        e.preventDefault(); // Required to allow dropping
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setWishList(wishList.push(e))
    };


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Navbar */}
            <NavBar />

            <div className="flex justify-center space-x-6 p-6 relative">
                <div className="w-[750px] flex flex-col space-y-6">
                    {/* User Profile */}
                    <div className="h-[400px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl flex flex-row gap-6">

                        <div className="h-[350px] w-[250px] flex flex-col items-center justify-between">
                            <div className="text-3xl font-bold text-center text-white">NAME</div>
                            <div className="h-[200px] w-[200px] bg-white rounded-full border-4 border-gray-800"></div>
                            <div className="w-full text-center bg-white rounded-3xl py-2">
                                <span className="text-lg font-bold text-black">Link to Spotify</span>
                            </div>
                        </div>

                        <div className="h-[350px] w-[400px] flex flex-col justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-1xl font-bold">Your City:</div>
                                <input className="flex-1 border border-gray-400 rounded-lg p-2" />
                            </div>
                            <div className="text-1xl font-bold">Your Preferences (Key Words):</div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-[50px] w-[120px] bg-white rounded-full border-4 border-gray-800 transition-transform transform hover:scale-[1.2] hover:shadow-xl"></div>
                                <div className="h-[50px] w-[120px] bg-white rounded-full border-4 border-gray-800 transition-transform transform hover:scale-[1.2] hover:shadow-xl"></div>
                                <div className="h-[50px] w-[120px] bg-white rounded-full border-4 border-gray-800 transition-transform transform hover:scale-[1.2] hover:shadow-xl"></div>
                                <div className="h-[50px] w-[120px] bg-white rounded-full border-4 border-gray-800 transition-transform transform hover:scale-[1.2] hover:shadow-xl"></div>
                                <div className="h-[50px] w-[120px] bg-white rounded-full border-4 border-gray-800 transition-transform transform hover:scale-[1.2] hover:shadow-xl"></div>
                                <div className="h-[50px] w-[120px] bg-white rounded-full border-4 border-gray-800 transition-transform transform hover:scale-[1.2] hover:shadow-xl"></div>
                            </div>
                            <div className="text-1xl font-bold">Your Top Artists:</div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="h-[75px] w-[75px] bg-white rounded-full border-4 border-gray-800 transform hover:scale-[1.2] hover:shadow-xl"></div>
                                <div className="h-[75px] w-[75px] bg-white rounded-full border-4 border-gray-800 transform hover:scale-[1.2] hover:shadow-xl"></div>
                                <div className="h-[75px] w-[75px] bg-white rounded-full border-4 border-gray-800 transform hover:scale-[1.2] hover:shadow-xl"></div>
                                <div className="h-[75px] w-[75px] bg-white rounded-full border-4 border-gray-800 transform hover:scale-[1.2] hover:shadow-xl"></div>
                            </div>
                        </div>

                    </div>

                    {/* Recomended Concerts */}
                    <div className="h-[380px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl flex flex-col justify-center">
                        <div className="text-2xl font-bold text-white text-center mb-4">Recommended Concerts</div>

                        <div className="flex-1 overflow-x-auto">
                            <div className="grid grid-rows-1 grid-flow-col gap-x-4 gap-y-4 w-max">
                                {concertList.map((concert, index) => (
                                    <ConcertItem
                                        key={index}
                                        concert={concert}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[750px] flex flex-col space-y-6">
                    {/* Past Concerts */}
                    <div className="h-[250px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl flex flex-col justify-center">
                        <div className="text-2xl font-bold text-white text-center mb-4">Past Concerts</div>

                        <div className="flex-1 overflow-x-auto">
                            <div className="grid grid-rows-1 grid-flow-col gap-x-4 gap-y-4 w-max">
                                {concertList.map((concert, index) => (
                                    <ConcertItem
                                        key={index}
                                        concert={concert}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Wish List */}
                    <div className="h-[530px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl flex flex-col items-center justify-center"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e)}>
                        <div className="text-2xl font-bold">Wish List</div>
                        <div className=" w-[650px] h-[450px] relative">
                            <div className="w-[180px] h-[180px] left-[239px] top-[159px] absolute bg-white rounded-full"></div>
                            <div className="w-[124px] h-[124px] left-[49px] top-[183px] absolute bg-white rounded-full"></div>
                            <div className="w-[80px] h-[80px] left-[280px] top-[370px] absolute bg-white rounded-full"></div>
                            <div className="w-[97px] h-[97px] left-[486px] top-[197px] absolute bg-white rounded-full"></div>
                            <div className="w-[97px] h-[97px] left-[550px] top-[39px] absolute bg-white rounded-full"></div>
                            <div className="w-[124px] h-[124px] left-[360px] top-[25px] absolute bg-white rounded-full"></div>
                            <div className="w-[124px] h-[124px] left-[459px] top-[326px] absolute bg-white rounded-full"></div>
                            <div className="w-[89px] h-[89px] left-[84px] top-[344px] absolute bg-white rounded-full"></div>
                            <div className="w-[89px] h-[89px] left-[173px] top-[60px] absolute bg-white rounded-full"></div>
                            <div className="w-[89px] h-[89px] left-[39px] top-[32px] absolute bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    )

}

export default UserPage