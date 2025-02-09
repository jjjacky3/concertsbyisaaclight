import './ConcertItem.css';
import { useState } from "react";

const ConcertDisplay = ({ tourTitle, tourDate, tourDes, tourRate, concertPrice }) => {

    const [borderWeight, setBorderWeight] = useState(0);

    tourTitle = "Tour, City"
    tourDate = "Jan 25"
    tourDes = "don13ofrh13iurf13pourh19i23[rhn132ioprn12oirn12oirhn12[irh12irhoui12rnpo1u2rn12purb1pu2br9pu12rh1892rh129rh891r1298rh128rh1280rh812"
    tourRate = 4.5
    concertPrice = "$90"

    return (
        <button
            className='ConcertDisplayBox'
            style={{ position: "relative", left: "10px", padding: "20px", border: `${borderWeight}px solid black`, cursor: "pointer" }}
            onClick={() => setBorderWeight(borderWeight === 0 ? 2 : 0)}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <p className='TourLabel' style={{ margin: 0 }}>{tourTitle}</p>
                <p className='DateLabel' style={{ margin: 0 }}>{tourDate}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <p className='TourDes' style={{ marginTop: '10px' }}>{tourDes}</p>
                <div className='RatingBox'>{tourRate}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '20px' }}>
                <p className='ConcertPriceBox'>{concertPrice}</p>
                <button className='FullDetailsButton'>Full Details</button>
            </div>
        </button>


    )
}

export default ConcertDisplay