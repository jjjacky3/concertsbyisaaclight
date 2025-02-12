import React from 'react';
import NavBar from '../components/NavBar';
import { goToArtist } from './nav_methods';

const HomePage = () => {
    return (
        <div>
            <NavBar goFunc={goToArtist} />
            <div>HI</div>
        </div>
    )
}

export default HomePage