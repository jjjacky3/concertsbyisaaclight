import NavBar from '../components/NavBar';
import ConcertItem from '../components/ConcertItem'
import ArtistBanner from '../components/ArtistBanner';
import { goToHome } from '../pages/nav_methods'
import '../pages/ArtistPage.css';


const ArtistPage = () => {


    return (
        <div className='ArtistPage'>
            <NavBar goFunc={goToHome} />
            <ArtistBanner />
            <div className='concertList'>
                <ConcertItem />
                <ConcertItem />
                <ConcertItem />
                <ConcertItem />
                <ConcertItem />
            </div>

        </div >



    )

}

export default ArtistPage