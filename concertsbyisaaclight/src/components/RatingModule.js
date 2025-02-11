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

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>1</div>
                <div style={{ marginLeft: '80px', height: '40px', width: '500px', marginRight: '80px' }}>
                    <div style={{ width: (oneLength + '%'), height: '100%', background: 'black' }}></div>
                </div>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{ratings[1]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>1</div>
                <div style={{ marginLeft: '80px', height: '40px', width: '500px', marginRight: '80px' }}>
                    <div style={{ width: (twoLength + '%'), height: '100%', background: 'black' }}></div>
                </div>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{ratings[2]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>1</div>
                <div style={{ marginLeft: '80px', height: '40px', width: '500px', marginRight: '80px' }}>
                    <div style={{ width: (threeLength + '%'), height: '100%', background: 'black' }}></div>
                </div>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{ratings[3]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>1</div>
                <div style={{ marginLeft: '80px', height: '40px', width: '500px', marginRight: '80px' }}>
                    <div style={{ width: (fourLength + '%'), height: '100%', background: 'black' }}></div>
                </div>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{ratings[4]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginTop: '20px', justifyContent: 'center' }}>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>1</div>
                <div style={{ marginLeft: '80px', height: '40px', width: '500px', marginRight: '80px' }}>
                    <div style={{ width: (fiveLength + '%'), height: '100%', background: 'black' }}></div>
                </div>
                <div style={{ fontSize: '20pt', fontWeight: 'bold' }}>{ratings[5]}</div>
            </div>

        </div >
    )

}

export default RatingModule