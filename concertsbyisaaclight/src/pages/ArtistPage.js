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

const ArtistPage = ({ artist }) => {


    const [selectedTour, setSelectedTour] = useState("All Tours");
    const [concertsShown, setConcertsShown] = useState([]);
    const [ratingsDisplayed, setRatingsDisplayed] = useState(artist.ratings);

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

    const handleChange = (event) => {
        setSelectedTour(event.target.value);


    }



    return (
        <div className='ArtistPage'>
            <NavBar goFunc={goToHome} />
            <ArtistBanner artist={artist} selectedTour={selectedTour} changeTourFunc={handleChange} />
            <div style={{ display: 'flex', position: 'relative', }}>
                <div className='concertList'>
                    {
                        concertsShown.map((concert, index) => (
                            <ConcertItem key={index} concert={concert} />
                        ))
                    }
                </div >
                <div style={{ height: '800px', width: '750px', marginLeft: '10px' }}>
                    <div className='ratingModule'>
                        <RatingModule ratings={ratingsDisplayed}></RatingModule>
                    </div>
                    <div className='compModule'></div>
                </div>
            </div>
        </div >

    )

}

export default ArtistPage