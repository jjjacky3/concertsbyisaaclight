import ArtistBanner from "../components/ArtistBanner"
import React, { useState, useEffect } from "react";
import NavBar from '../components/NavBar'
import ConcertItem from "../components/ConcertItem";
import RatingModule from "../components/RatingModule";
import CompareModule from "../components/CompareModule";
import ConcertExpandedView from "../components/ConcertExpandView";

const ArtistPage = ({ artist, navigateToHome }) => {
    const [selectedTour, setSelectedTour] = useState("All Tours");
    const [concertsShown, setConcertsShown] = useState([]);
    const [ratingsDisplayed, setRatingsDisplayed] = useState(artist.ratings || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    const [compartedConcertOne, setComparedConcertOne] = useState(null)
    const [compartedConcertTwo, setComparedConcertTwo] = useState(null)
    const [selectedConcert, setSelectedConcert] = useState(null)

    useEffect(() => {
        // Initialize with the artist's concerts (or empty array if none)
        setConcertsShown(artist.concerts || []);
        
        // Initialize with the artist's ratings (or default if none)
        setRatingsDisplayed(artist.ratings || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    }, [artist]);

    useEffect(() => {
        if (selectedTour === "All Tours") {
            setConcertsShown(artist.concerts || []);
            setRatingsDisplayed(artist.ratings || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
        } else {
            // Only filter if there are concerts
            if (artist.concerts && artist.concerts.length > 0) {
                setConcertsShown(artist.concerts.filter(concert => concert.tour.name === selectedTour));
                
                // Only use findTour if it exists
                if (typeof artist.findTour === 'function') {
                    const tourRatings = artist.findTour(selectedTour);
                    if (tourRatings) {
                        setRatingsDisplayed(tourRatings);
                    }
                }
            } else {
                setConcertsShown([]);
            }
        }
    }, [selectedTour, artist]);

    const handleChange = (event) => {
        setSelectedTour(event.target.value);
    }

    const concertItemClicked = (concert) => {
        setSelectedConcert(concert)
    };

    const closeOverlay = () => {
        setSelectedConcert(null)
    }

    const handleConcertDrop = (concert, side) => {
        if (side == 'left') {
            setComparedConcertOne(concert);
        }
        else if (side == 'right') {
            setComparedConcertTwo(concert);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative">
            {/* Navbar */}
            <NavBar navigateToHome={navigateToHome} />

            {/* Artist Banner */}
            <ArtistBanner artist={artist} selectedTour={selectedTour} changeTourFunc={handleChange} />

            {/* Page Layout */}
            <div className="flex justify-center space-x-6 p-6 relative">
                {/* Concert List Container */}
                <div className="w-[700px] h-[800px] bg-gray-800 rounded-lg shadow-lg overflow-y-auto p-4 
                grid grid-cols-2 gap-4">
                    {concertsShown.length > 0 ? (
                        concertsShown.map((concert, index) => (
                            <ConcertItem
                                key={index}
                                concert={concert}
                                clickItemFunc={concertItemClicked}
                                isSelected={concert === compartedConcertOne || concert === compartedConcertTwo}
                            />
                        ))
                    ) : (
                        <div className="col-span-2 flex flex-col items-center justify-center h-full text-gray-400">
                            <p className="text-xl mb-4">No concerts available for this artist yet.</p>
                            <p>This artist doesn't have any concerts in our database.</p>
                        </div>
                    )}
                </div>

                {/* Overlay Panel */}
                {selectedConcert && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[600px] h-[400px] flex flex-col items-center justify-center">
                            <ConcertExpandedView 
                                concert={selectedConcert} 
                                closeOverlay={closeOverlay} 
                            />
                        </div>
                    </div>
                )}

                {/* Right Side Content (Ratings & Comparison) */}
                <div className="w-[750px] flex flex-col space-y-6">
                    {/* Rating Module */}
                    <div className="h-[400px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl">
                        <RatingModule ratings={ratingsDisplayed} />
                    </div>

                    {/* Compare Module */}
                    <div className="h-[380px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl">
                        <CompareModule 
                            concert1={compartedConcertOne} 
                            concert2={compartedConcertTwo} 
                            onDropConcert={handleConcertDrop} 
                            setConcertOne={setComparedConcertOne} 
                            setConcertTwo={setComparedConcertTwo} 
                        />
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ArtistPage