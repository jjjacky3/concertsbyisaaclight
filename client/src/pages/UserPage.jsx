import ArtistBanner from "../components/ArtistBanner"
import Artist from "../../../server/models/Artist"
import Tour from "../../../server/models/Tour"
import Concert from "../../../server/models/DamienConcert"
import React, { useState, useEffect } from "react";
import NavBar from '../components/NavBar'
import ConcertItem from "../components/ConcertItem";
import RatingModule from "../components/RatingModule";
import CompareModule from "../components/CompareModule";
import ConcertExpandedView from "../components/ConcertExpandView";
import WishListBubble from "../components/WishListBubble";
import { parse } from 'flatted';

const UserPage = ({ artist }) => {

    const wishListBubbleLayoutKey = {
        0: [1.8, '280px', '200px'],
        1: [1.24, '45px', '183px'],
        2: [1.24, '470px', '340px'],
        3: [1.24, '380px', '40px'],
        4: [1, '170px', '30px'],
        5: [1, '-10px', '0px'],
        6: [1, '90px', '330px'],
        7: [1, '90px', '330px'],
        8: [1, '280px', '370px'],
        9: [1, '520px', '190px'],
        10: [1, '550px', '20px']
    };
    const concertList = artist.concerts
    const testConcert = concertList[1]
    const [wishList, setWishList] = useState([]);
    const [selectedConcert, setSelectedConcert] = useState(null)
    console.log("TestConcert:")
    console.log(testConcert)

    // useEffect(() => {
    //     setWishList([testConcert])
    //     console.log(wishList)
    // }, [testConcert]);

    const handleDragOver = (e) => {
        e.preventDefault(); // Required to allow dropping
    };

    const handleDrop = (e) => {
        e.preventDefault();
        try {
            const concertData = parse(e.dataTransfer.getData("concertData"));
            const inWishList = wishList.some(item => item.id === concertData.id);
            if (!inWishList) {
                console.log("Data:")
                console.log(concertData)
                setWishList((prevList) => {
                    const updatedList = [...prevList, concertData];
                    const sortedList = updatedList.sort((a, b) => new Date(a.date) - new Date(b.date));

                    return sortedList;
                });

            }
            else {
                console.log("Already there")
            }
        } catch (err) {
            console.error("Failed to parse concertData", err);
        }
    };

    const concertItemClicked = (concert) => {
        setSelectedConcert(concert)
    };

    const closeOverlay = () => {
        setSelectedConcert(null)
    }


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Navbar */}
            <NavBar />

            {/* Overlay Panel */}
            {selectedConcert && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[600px] h-[400px] flex flex-col items-center justify-center">
                        <ConcertExpandedView concert={selectedConcert} closeOverlay={closeOverlay} />
                    </div>
                </div>
            )}

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
                            {wishList.map((concertdata, index) => (
                                <WishListBubble
                                    key={index}
                                    concertdata={concertdata}
                                    clickItemFunc={concertItemClicked}
                                    isSelected={true}
                                    scale={wishListBubbleLayoutKey[index][0]}
                                    left={`${wishListBubbleLayoutKey[index][1]}`}
                                    top={`${wishListBubbleLayoutKey[index][2]}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>

    )

}

export default UserPage