import React from 'react';
import NavBar from '../components/NavBar';
import { goToHome } from '../pages/nav_methods'


const LoginPage = () => {


    return (
        <div className='LoginPage'>
            <NavBar goFunc={goToHome} />
            <div style={{ width: '100%', height: 100, background: '#D9D9D9', position: 'absolute', top: '70px' }} />
            <div style={{ width: '100%', height: 50, textAlign: 'center', color: 'black', fontSize: 64, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word', position: 'relative', zIndex: 1 }}>OnlyConcerts</div>
        </div>

    )

}

export default LoginPage