import '../components/ComponentStyling/NavBar.css'
import { useNavigate } from 'react-router-dom';


const NavBar = ({ goFunc }) => {


    return (
        <div style={{ width: "100%", height: 70, position: 'relative' }}>
            <div className="NavBarBackground"></div>
            <div className="LogoIcon"></div>
            <input className="SearchBar" style={{ position: 'absolute', left: '122px', top: '6px' }} />
            <input className="SearchBar" style={{ position: 'absolute', left: '670px', top: '6px' }} />
            <button className="SearchButton" onClick={() => goFunc()} style={{ position: 'absolute', right: '40px', top: '5px' }}></button>
        </div >
    )
}

export default NavBar