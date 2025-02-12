import { useNavigate } from 'react-router-dom';

const goToHome = (navigate) => {
    navigate('./HomePage')
}

const goToArtist = (navigate) => {
    navigate('./ArtistPage')
}
export {
    goToHome, goToArtist
}