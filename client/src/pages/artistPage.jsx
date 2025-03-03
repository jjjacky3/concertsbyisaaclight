import ArtistBanner from "../components/ArtistBanner";
import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
import NavBar from '../components/NavBar';
import ConcertItem from "../components/ConcertItem";
import RatingModule from "../components/RatingModule";
import CompareModule from "../components/CompareModule";
import ConcertExpandedView from "../components/ConcertExpandView";

const ArtistPage = () => {
    // Extract artistId from URL path manually instead of using useParams
    const path = window.location.pathname;
    const artistId = path.split('/artist/')[1];
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [selectedTour, setSelectedTour] = useState("All Tours");
    const [concertsShown, setConcertsShown] = useState([]);
    const [ratingsDisplayed, setRatingsDisplayed] = useState({});
    const [comparedConcertOne, setComparedConcertOne] = useState(null);
    const [comparedConcertTwo, setComparedConcertTwo] = useState(null);
    const [selectedConcert, setSelectedConcert] = useState(null);

    // Fetch artist data based on artistId
    useEffect(() => {
        const fetchArtistData = async () => {
            setLoading(true);
            try {
                // In a real application, you would fetch this from your API
                // For now, we'll simulate this with a timeout
                
                // Example API call:
                // const response = await fetch(`http://localhost:3000/api/artists/${artistId}`);
                // if (!response.ok) throw new Error('Failed to fetch artist data');
                // const data = await response.json();
                
                // For now, let's create a dummy artist if no data is found
                setTimeout(() => {
                    // This simulates an API response
                    const artistData = {
                        name: `Artist ${artistId}`,
                        image: "https://via.placeholder.com/1200x300",
                        ratings: { 5: 10, 4: 5, 3: 3, 2: 1, 1: 1 },
                        goAgain: 85,
                        tours: [
                            { name: "World Tour 2025" },
                            { name: "Summer Festival Tour" }
                        ],
                        concerts: [
                            {
                                name: "Concert 1",
                                date: "April 15",
                                city: "New York",
                                rating: 4.7,
                                price: 75,
                                desc: "An amazing concert experience",
                                tour: { name: "World Tour 2025" }
                            },
                            {
                                name: "Concert 2",
                                date: "May 20",
                                city: "Los Angeles",
                                rating: 4.5,
                                price: 85,
                                desc: "Don't miss this spectacular show",
                                tour: { name: "Summer Festival Tour" }
                            }
                        ],
                        avgRating: function() {
                            const total = Object.entries(this.ratings).reduce(
                                (sum, [rating, count]) => sum + (Number(rating) * count), 0
                            );
                            const count = Object.values(this.ratings).reduce((sum, count) => sum + count, 0);
                            return count > 0 ? (total / count).toFixed(1) : "N/A";
                        },
                        findTour: function(tourName) {
                            if (tourName === "All Tours") return this.ratings;
                            const tourConcerts = this.concerts.filter(c => c.tour.name === tourName);
                            // Create a ratings object for the specific tour
                            return { 5: 5, 4: 3, 3: 2, 2: 1, 1: 0 }; // Dummy data
                        }
                    };
                    
                    setArtist(artistData);
                    setConcertsShown(artistData.concerts);
                    setRatingsDisplayed(artistData.ratings);
                    setLoading(false);
                }, 500);
                
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchArtistData();
    }, [artistId]);

    useEffect(() => {
        if (!artist) return;
        
        if (selectedTour === "All Tours") {
            setConcertsShown(artist.concerts);
            setRatingsDisplayed(artist.ratings);
        } else {
            setConcertsShown(artist.concerts.filter(concert => concert.tour.name === selectedTour));
            setRatingsDisplayed(artist.findTour(selectedTour));
        }
    }, [selectedTour, artist]);

    const handleChange = (event) => {
        setSelectedTour(event.target.value);
    };

    const concertItemClicked = (concert) => {
        setSelectedConcert(concert);
    };

    const closeOverlay = () => {
        setSelectedConcert(null);
    };

    const handleConcertDrop = (concert, side) => {
        if (side === 'left') {
            setComparedConcertOne(concert);
        } else if (side === 'right') {
            setComparedConcertTwo(concert);
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
                <NavBar />
                <div className="text-xl">Loading artist information...</div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                <NavBar />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
                    <h2 className="text-2xl font-bold mb-4">Artist Not Found</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // Show artist page if data is loaded
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative">
            {/* Navbar */}
            <NavBar />

            {/* Artist Banner */}
            <ArtistBanner artist={artist} selectedTour={selectedTour} changeTourFunc={handleChange} />

            {/* Page Layout */}
            <div className="flex justify-center space-x-6 p-6 relative">
                {/* Concert List Container */}
                <div className="w-[700px] h-[800px] bg-gray-800 rounded-lg shadow-lg overflow-y-auto p-4 
                grid grid-cols-2 gap-4">
                    {concertsShown.map((concert, index) => (
                        <ConcertItem
                            key={index}
                            concert={concert}
                            clickItemFunc={concertItemClicked}
                            isSelected={concert === comparedConcertOne || concert === comparedConcertTwo}
                        />
                    ))}
                </div>

                {/* Overlay Panel */}
                {selectedConcert && (
                    <ConcertExpandedView 
                        concert={selectedConcert} 
                        closeOverlay={closeOverlay}
                    />
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
                            concert1={comparedConcertOne} 
                            concert2={comparedConcertTwo} 
                            onDropConcert={handleConcertDrop} 
                            setConcertOne={setComparedConcertOne} 
                            setConcertTwo={setComparedConcertTwo} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistPage;