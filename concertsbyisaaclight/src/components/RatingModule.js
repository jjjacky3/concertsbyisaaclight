import '../components/RatingModule.css';

const RatingModule = ({ ratings }) => {

    if (!ratings) {
        console.error("Received undefined ratings in RatingModule");
        return <div>Error: Ratings data is missing</div>;
    }

    console.log("Ratings Input for modlue ius")
    console.log(ratings)
    let maxValue = Math.max(...Object.values(ratings))


    let oneLength = ratings[1] / maxValue * 100
    let twoLength = ratings[2] / maxValue * 100
    let threeLength = ratings[3] / maxValue * 100
    let fourLength = ratings[4] / maxValue * 100
    let fiveLength = ratings[5] / maxValue * 100




    return (
        <div style={{ position: 'relative' }}>
            <div className='Header'>Ratings</div>

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'left', color: 'white' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>1</div>
                <div style={{ marginLeft: '60px', height: '40px', width: '500px', marginRight: '40px', border: 'white solid 2px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                    <div className='Bar' style={{ width: (oneLength + '%') }}></div>
                </div>
                <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>{(ratings[1] + ' reviews')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'left', color: 'white' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>2</div>
                <div style={{ marginLeft: '60px', height: '40px', width: '500px', marginRight: '40px', border: 'white solid 2px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                    <div className='Bar' style={{ width: (twoLength + '%') }}></div>
                </div>
                <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>{(ratings[2] + ' reviews')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'left', color: 'white' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>3</div>
                <div style={{ marginLeft: '60px', height: '40px', width: '500px', marginRight: '40px', border: 'white solid 2px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                    <div className='Bar' style={{ width: (threeLength + '%') }}></div>
                </div>
                <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>{(ratings[3] + ' reviews')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'left', color: 'white' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>4</div>
                <div style={{ marginLeft: '60px', height: '40px', width: '500px', marginRight: '40px', border: 'white solid 2px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                    <div className='Bar' style={{ width: (fourLength + '%') }}></div>
                </div>
                <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>{(ratings[4] + ' reviews')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'left', color: 'white' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>5</div>
                <div style={{ marginLeft: '60px', height: '40px', width: '500px', marginRight: '40px', border: 'white solid 2px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                    <div className='Bar' style={{ width: (fiveLength + '%') }}></div>
                </div>
                <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>{(ratings[5] + ' reviews')}</div>
            </div>

        </div >
    )

}

export default RatingModule