import NavBar from '../components/NavBar';
import ConcertDisplay from '../components/ConcertItem'
import { goToHome } from '../pages/nav_methods'



const ArtistPage = () => {


    return (
        <div className='ArtistPage'>
            <NavBar goFunc={goToHome} />
            <ConcertDisplay />
        </div >



    )

}

export default ArtistPage