import NavBar from '../components/NavBar';
import ConcertDisplay from '../components/ConcertItem'
import ArtistBanner from '../components/ArtistBanner';
import { goToHome } from '../pages/nav_methods'
import '../pages/ArtistPage.css';


const ArtistPage = () => {


    return (
        <div className='ArtistPage'>
            <NavBar goFunc={goToHome} />
            <ArtistBanner />
            <div className='concertList'>
                <ConcertDisplay />
            </div>

        </div >



    )

}

export default ArtistPage