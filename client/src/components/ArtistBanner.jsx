const ArtistBanner = ({ artist, selectedTour, changeTourFunc }) => {

    let artistImage = artist.image;
    let artistRating = artist.avgRating()
    let artistName = artist.name;
    let goAgain = artist.goAgain + '%';
    console.log(typeof (selectedTour))


    return (
        <div className='ArtistBanner' style={{ backgroundImage: artistImage, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', height: '120px', position: 'relative' }}>
                <div className='BannerRatingBox'>{artistRating}</div>
                <div className='ArtistName'>{artistName}</div>
            </div>
            <div style={{ width: '500px', top: '150px', height: '120px', left: '30px', position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className='GoAgain'>
                    <strong>{goAgain}</strong>
                    <span style={{ fontSize: '20px' }}>Would go Again</span>
                </div>
                <div style={{ width: '1px', height: '100px', border: '1px solid white', left: '200px', background: 'white', position: 'absolute' }}></div>
                {/*<select className='AllToursSelection' value={selectedTour} onChange={changeTourFunc}>
                    <option value="All Tours">All Tours</option>
                    <option value="Tour1"></option>
                    
                    {artist.tours.map((tour, index) => (
                        <option key={index} value={tour.name}>{tour.name}</option>
                    ))}
                    
                </select>*/}
            </div>


        </div >

    )

}


export default ArtistBanner