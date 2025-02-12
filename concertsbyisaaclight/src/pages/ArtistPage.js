import NavBar from '../components/NavBar';
import ConcertItem from '../components/ConcertItem'
import ArtistBanner from '../components/ArtistBanner';
import { goToHome } from '../pages/nav_methods'
import '../pages/ArtistPage.css';
import Artist from '../models/Artist';
import Concert from '../models/Concert';
import React, { useState, useEffect } from "react";
import RatingModule from '../components/RatingModule';
import Tour from '../models/Tour';
import CompareModule from '../components/CompareModule';

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
        if (!compartedConcertOne) {
            setComparedConcertOne(concert);
            console.log("Concert 1 Updated")
        } else if (!compartedConcertTwo) {
            setComparedConcertTwo(concert);
            console.log("Concert 2 Updated")
        } else {
            setComparedConcertOne(concert);
            setComparedConcertTwo(null);
        }
    };




    return (
        <div className='ArtistPage'>
            <NavBar goFunc={goToHome} />
            <ArtistBanner artist={artist} selectedTour={selectedTour} changeTourFunc={handleChange} />
            <div style={{ display: 'flex', position: 'relative', }}>
                <div className='concertList'>
                    {
                        concertsShown.map((concert, index) => (
                            <ConcertItem key={index} concert={concert} clickItemFunc={concertItemClicked} />
                        ))
                    }
                </div >
                <div style={{ height: '800px', width: '750px', marginLeft: '10px' }}>
                    <div className='ratingModule'>
                        <RatingModule ratings={ratingsDisplayed}></RatingModule>
                    </div>
                    <div className='compModule'>
                        <CompareModule concert1={compartedConcertOne} concert2={compartedConcertTwo}></CompareModule>
                    </div>
                </div>
            </div>
        </div >

    )

}

export default ArtistPage