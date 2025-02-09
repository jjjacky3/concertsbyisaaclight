import React from 'react';
import NavBar from '../components/NavBar';
import { goToHome } from '../pages/nav_methods'


const LoginPage = () => {


    return (
        <div className='LoginPage'>
            <NavBar goFunc={goToHome} />
            <div style={{ width: '100%', height: 100, background: '#D9D9D9', position: 'relative', top: '0px' }}>
                <div style={{ width: '100%', height: 100, textAlign: 'center', color: 'black', fontSize: 64, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word', position: 'absolute', zIndex: 1, top: '10px' }}>OnlyConcerts</div>
            </div>
            <div style={{ width: 500, height: 500, background: '#D9D9D9', borderRadius: 20, position: 'relative', left: '570px', top: '120px' }}>
                <div style={{ width: 250, height: 61, textAlign: 'center', color: 'black', fontSize: 32, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word', position: 'absolute', left: '25%', top: '5%' }}>Username</div>
                <div style={{ width: 250, height: 61, textAlign: 'center', color: 'black', fontSize: 32, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word', position: 'absolute', left: '25%', top: '50%' }}>Password</div>
                <input style={{ width: 455, height: 60, borderRadius: 20, position: 'absolute', left: "20px", top: '100px' }}></input>
                <input style={{ width: 455, height: 60, borderRadius: 20, position: 'absolute', left: "20px", top: '350px' }}></input>
            </div>
        </div>

    )

}

export default LoginPage