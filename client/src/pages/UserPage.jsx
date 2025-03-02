import ArtistBanner from "../components/ArtistBanner"
import Artist from "../../../server/models/Artist"
import Tour from "../../../server/models/Tour"
import Concert from "../../../server/models/DamienConcert"
import React, { useState, useEffect } from "react";
import NavBar from '../components/NavBar'
import ConcertItem from "../components/ConcertItem";
import RatingModule from "../components/RatingModule";
import CompareModule from "../components/CompareModule";

const UserPage = () => {


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Navbar */}
            <NavBar />

        </div>

    )

}

export default UserPage