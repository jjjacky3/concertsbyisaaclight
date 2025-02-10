import './ArtistBanner.css';
import React, { useState } from "react";
import Artist from '../models/Artist';

const ArtistBanner = ({ artist }) => {

    let artistImage = artist.image;
    let artistRating = artist.rating;
    let artistName = artist.name;
    let goAgain = artist.goAgain + '%';

    // Dropdown State
    const [selectedValue, setSelectedValue] = useState("All Tours");

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    }



    return (
        <div className='ArtistBanner' style={{ backgroundImage: artistImage, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', height: '120px', position: 'relative' }}>
                <div className='BannerRatingBox'>{artistRating}</div>
                <div className='ArtistName'>{artistName}</div>
            </div>
            <div style={{ width: '500px', top: '150px', height: '120px', left: '30px', position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className='GoAgain'>
                    <strong>{goAgain}</strong>
                    <span style={{ fontSize: '20px' }}>Would go Again</span>
                </div>
                <div style={{ width: '1px', height: '100px', border: '1px solid white', left: '200px', background: 'white', position: 'absolute' }}></div>
                <select className='AllToursSelection' value={selectedValue} onChange={handleChange}>
                    <option value="">All Tours</option> {/* Default empty option */}
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </select>
            </div>


        </div >

    )

}


export default ArtistBanner