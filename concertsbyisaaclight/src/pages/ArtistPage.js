import NavBar from '../components/NavBar';
import ConcertItem from '../components/ConcertItem'
import ArtistBanner from '../components/ArtistBanner';
import { goToHome } from '../pages/nav_methods'
import '../pages/ArtistPage.css';
import Artist from '../models/Artist';
import Concert from '../models/Concert';

const ArtistPage = () => {

    const artist1 = new Artist('Alec Benjamin', 4.5, `url('/graphics/AlecBenjaminBanner.jpg')`, 88)
    const concert1 = new Concert('Alec Benjamin', 'AB1', 'Jan 20', 'Atlanta', 4.6, '3jd1jieroi12r1i2r', 90)
    artist1.addConcert(concert1)


    return (
        <div className='ArtistPage'>
            <NavBar goFunc={goToHome} />
            <ArtistBanner artist={artist1} />
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