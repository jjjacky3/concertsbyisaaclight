import ArtistBanner from "../components/ArtistBanner"
import Artist from "../../../server/models/Artist"
import Tour from "../../../server/models/Tour"
import Concert from "../../../server/models/DamienConcert"
import React, { useState, useEffect } from "react";

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

        if (concert == compartedConcertOne || concert == compartedConcertTwo) {
            setComparedConcertOne(null);
            setComparedConcertTwo(null);
        }

        else if (!compartedConcertOne) {
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
        <div>
            <div>test</div>
            <ArtistBanner artist={artist} selectedTour={selectedTour} changeTourFunc={handleChange} />
        </div>

    )

}

export default ArtistPage