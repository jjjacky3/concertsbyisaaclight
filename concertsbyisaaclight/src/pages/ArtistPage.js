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

const ArtistPage = () => {

    //Dummy Concerts
    const artist1 = new Artist('Alec Benjamin', { 1: 1, 2: 1, 3: 1, 4: 2, 5: 10 }, `url('/graphics/AlecBenjaminBanner.jpg')`, 88)
    const tour1 = new Tour(artist1, 'Narrated by Heart Tour')
    const tour2 = new Tour(artist1, "The Lyricist's Journey Tour")
    const concert1 = new Concert(
        'Alec Benjamin',
        'The Storyteller’s Night',
        'Jan 20',
        'Atlanta',
        4.6,
        'Join Alec Benjamin for an unforgettable evening of storytelling and music on the "Narrated by Heart Tour." Experience his raw, heartfelt lyrics and intimate melodies live as he takes you on a journey through songs like never before. With a setlist featuring fan favorites and exclusive unreleased tracks, this concert promises an emotional and mesmerizing performance that will leave you captivated.',
        90,
        tour1)
    artist1.addConcert(concert1)
    const concert2 = new Concert(
        'Alec Benjamin',
        'Poetry in Motion',
        'March 15',
        'Los Angeles',
        4.8,
        'Step into a world of vivid storytelling and heartfelt melodies with Alec Benjamin’s "The Lyricist’s Journey Tour." This one-night-only experience will immerse fans in his signature acoustic sound, raw emotions, and captivating narratives. From beloved classics to new, soul-stirring tracks, this concert promises to be a night to remember.',
        79,
        tour2)
    artist1.addConcert(concert2)

    const concert3 = new Concert(
        'Alec Benjamin',
        'Verses & Echoes',
        'June 22',
        'Chicago',
        4.3,
        'Lose yourself in the poetic storytelling and hauntingly beautiful melodies of Alec Benjamin’s "Reflections in Sound Tour." This intimate performance will take audiences on an emotional journey through music, blending heartfelt lyrics with captivating instrumentals. Featuring a mix of chart-topping hits and exclusive new material, this concert is a must-see for fans who love music that tells a story.',
        50,
        tour2)
    artist1.addConcert(concert3)
    console.log("final concert added")



    const [selectedTour, setSelectedTour] = useState("All Tours");
    const [concertsShown, setConcertsShown] = useState([]);
    const [ratingsDisplayed, setRatingsDisplayed] = useState(artist1.ratings);

    useEffect(() => {
        if (selectedTour === "All Tours") {
            setConcertsShown(artist1.concerts);
            setRatingsDisplayed(artist1.ratings)
        } else {
            setConcertsShown(artist1.concerts.filter(concert => concert.tour.name === selectedTour));
            setRatingsDisplayed(artist1.findTour(selectedTour))
            console.log("setRatingDisplayed Ran")
            console.log(ratingsDisplayed)
            console.log("SelectedTour Is;")
            console.log(artist1.findTour(selectedTour))
        }
    }, [selectedTour]);

    const handleChange = (event) => {
        setSelectedTour(event.target.value);


    }



    return (
        <div className='ArtistPage'>
            <NavBar goFunc={goToHome} />
            <ArtistBanner artist={artist1} selectedTour={selectedTour} changeTourFunc={handleChange} />
            <div style={{ display: 'flex', position: 'relative', }}>
                <div className='concertList'>
                    {
                        concertsShown.map((concert, index) => (
                            <ConcertItem key={index} concert={concert} />
                        ))
                    }
                </div >
                <div style={{ height: '800px', width: '800px', marginLeft: '10px' }}>
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