import './ArtistBanner.css';

const ArtistBanner = (artistImage, artistRating, artistName) => {

    artistImage = `url('/graphics/AlecBenjaminBanner.jpg')`
    artistRating = 4.7
    artistName = "Alec Benjamin"


    return (
        <div className='ArtistBanner' style={{ backgroundImage: artistImage }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', height: '120px', position: 'relative' }}>
                <div className='BannerRatingBox'>{artistRating}</div>
                <div className='ArtistName'>{artistName}</div>
            </div>

        </div>

    )

}


export default ArtistBanner