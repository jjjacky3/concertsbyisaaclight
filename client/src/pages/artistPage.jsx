import ArtistBanner from "../components/ArtistBanner"
import Artist from "../../../server/models/Artist"
import Tour from "../../../server/models/Tour"
import Concert from "../../../server/models/DamienConcert"
import React, { useState, useEffect } from "react";
import NavBar from '../components/NavBar'
import ConcertItem from "../components/ConcertItem";
import RatingModule from "../components/RatingModule";
import CompareModule from "../components/CompareModule";

const ArtistPage = ({ artist }) => {


    const [selectedTour, setSelectedTour] = useState("All Tours");
    const [concertsShown, setConcertsShown] = useState([]);
    const [ratingsDisplayed, setRatingsDisplayed] = useState(artist.ratings);
    const [compartedConcertOne, setComparedConcertOne] = useState(null)
    const [compartedConcertTwo, setComparedConcertTwo] = useState(null)

    useEffect(() => {
        if (selectedTour === "All Tours") {
            setConcertsShown(artist.concerts);
            setRatingsDisplayed(artist.ratings)
        } else {
            setConcertsShown(artist.concerts.filter(concert => concert.tour.name === selectedTour));
            setRatingsDisplayed(artist.findTour(selectedTour))
            console.log("setRatingDisplayed Ran")
            console.log(ratingsDisplayed)
            console.log("SelectedTour Is;")
            console.log(artist.findTour(selectedTour))
        }
    }, [selectedTour, ratingsDisplayed]);

    useEffect(() => {
        console.log("Updated Compared Concerts:");
        console.log("Concert 1:", compartedConcertOne?.name);
        console.log("Concert 2:", compartedConcertTwo?.name);
    }, [compartedConcertOne, compartedConcertTwo]);

    const handleChange = (event) => {
        setSelectedTour(event.target.value);
    }

    const concertItemClicked = (concert) => {
        console.log("Concert Item Clicked")

        // if (concert == compartedConcertOne || concert == compartedConcertTwo) {
        //     setComparedConcertOne(null);
        //     setComparedConcertTwo(null);
        // }

        // else if (!compartedConcertOne) {
        //     setComparedConcertOne(concert);
        //     console.log("Concert 1 Updated")
        // } else if (!compartedConcertTwo) {
        //     setComparedConcertTwo(concert);
        //     console.log("Concert 2 Updated")
        // } else {
        //     setComparedConcertOne(concert);
        //     setComparedConcertTwo(null);
        // }
    };

    const handleConcertDrop = (concert, side) => {
        console.log("Dropped Concert:", concert);

        if (side == 'left') {
            setComparedConcertOne(concert);
            console.log("Concert 1 Updated")
        }
        else if (side == 'right') {
            setComparedConcertTwo(concert);
            console.log("Concert 2 Updated")
        }
        else {
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Navbar */}
            <NavBar />

            {/* Artist Banner */}
            <ArtistBanner artist={artist} selectedTour={selectedTour} changeTourFunc={handleChange} />

            {/* Page Layout */}
            <div className="flex justify-center space-x-6 p-6">
                {/* Concert List Container */}
                <div className="w-[700px] h-[800px] bg-gray-800 rounded-lg shadow-lg overflow-y-auto p-4 
                grid grid-cols-2 gap-4">
                    {/* <div className="w-[700px] h-[800px] bg-gray-800 rounded-lg shadow-lg overflow-y-auto p-4 space-y-4"> */}
                    {concertsShown.map((concert, index) => (
                        <ConcertItem
                            key={index}
                            concert={concert}
                            clickItemFunc={concertItemClicked}
                            isSelected={concert === compartedConcertOne || concert === compartedConcertTwo}
                        />
                    ))}
                </div>

                {/* Right Side Content (Ratings & Comparison) */}
                <div className="w-[750px] flex flex-col space-y-6">
                    {/* Rating Module */}
                    <div className="h-[400px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl">
                        <RatingModule ratings={ratingsDisplayed} />
                    </div>

                    {/* Compare Module */}
                    <div className="h-[380px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl">
                        <CompareModule concert1={compartedConcertOne} concert2={compartedConcertTwo} onDropConcert={handleConcertDrop} />
                    </div>
                </div>
            </div>
        </div >
    );


}

export default ArtistPage