import './ArtistBanner.css';

const ArtistBanner = (artistImage, artistRating, artistName, goAgain) => {

    artistImage = `url('/graphics/AlecBenjaminBanner.jpg')`
    artistRating = 4.7
    artistName = "Alec Benjamin"
    goAgain = "88%"


    return (
        <div className='ArtistBanner' style={{ backgroundImage: artistImage, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', height: '120px', position: 'relative' }}>
                <div className='BannerRatingBox'>{artistRating}</div>
                <div className='ArtistName'>{artistName}</div>
            </div>
            <div style={{ border: '2px solid white', width: '1000px', top: '150px', height: '120px', left: '30px', position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className='GoAgain'>
                    <strong>{goAgain}</strong>
                    <span style={{ fontSize: '20px' }}>Would go Again</span>
                </div>
                <div style={{ width: '1px', height: '100px', border: '1px solid white', left: '200px', background: 'white', position: 'absolute' }}></div>
            </div>
            <button className='AllToursSelection'></button>

        </div >

    )

}


export default ArtistBanner