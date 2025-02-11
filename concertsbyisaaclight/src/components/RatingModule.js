import '../components/RatingModule.css';

const RatingModule = ({ artist }) => {

    let maxValue = Math.max(...Object.values(artist.ratings))


    let oneLength = artist.ratings[1] / maxValue * 100
    let twoLength = artist.ratings[2] / maxValue * 100
    let threeLength = artist.ratings[3] / maxValue * 100
    let fourLength = artist.ratings[4] / maxValue * 100
    let fiveLength = artist.ratings[5] / maxValue * 100




    return (
        <div style={{ position: 'relative' }}>
            <div className='Header'>Ratings</div>

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>1</div>
                <div style={{ marginLeft: '80px', height: '40px', width: '500px', marginRight: '80px' }}>
                    <div style={{ width: (oneLength + '%'), height: '100%', background: 'black' }}></div>
                </div>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{artist.ratings[1]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>1</div>
                <div style={{ marginLeft: '80px', height: '40px', width: '500px', marginRight: '80px' }}>
                    <div style={{ width: (twoLength + '%'), height: '100%', background: 'black' }}></div>
                </div>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{artist.ratings[2]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>1</div>
                <div style={{ marginLeft: '80px', height: '40px', width: '500px', marginRight: '80px' }}>
                    <div style={{ width: (threeLength + '%'), height: '100%', background: 'black' }}></div>
                </div>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{artist.ratings[3]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>1</div>
                <div style={{ marginLeft: '80px', height: '40px', width: '500px', marginRight: '80px' }}>
                    <div style={{ width: (fourLength + '%'), height: '100%', background: 'black' }}></div>
                </div>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{artist.ratings[4]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>1</div>
                <div style={{ marginLeft: '80px', height: '40px', width: '500px', marginRight: '80px' }}>
                    <div style={{ width: (fiveLength + '%'), height: '100%', background: 'black' }}></div>
                </div>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{artist.ratings[5]}</div>
            </div>

        </div >
    )

}

export default RatingModule