

const ArtistBanner = ({ artist, selectedTour, changeTourFunc }) => {

    let artistImage = artist.image;
    let artistRating = artist.avgRating()
    let artistName = artist.name;
    let goAgain = artist.goAgain + '%';
    console.log(typeof (selectedTour))


    return (
        <div
            className="relative w-full h-[300px] bg-cover bg-center text-white p-6 flex flex-col justify-between "
            style={{ backgroundImage: `url(${artistImage})` }}
        >
            {/* Top Section: Rating Box + Artist Name */}
            <div className="flex items-center justify-between h-[120px] relative">
                {/* ⭐ Larger Rating Box */}
                <div className="w-[100px] h-[100px] flex items-center justify-center text-center text-white text-5xl font-bold border-4 border-white rounded-2xl shadow-md ml-6 mt-5">
                    {artistRating}
                </div>

                {/* 🎤 Artist Name */}
                <h1 className="absolute left-[150px] text-5xl font-bold mt-5">{artistName}</h1>
            </div>

            {/* Bottom Section: Go Again + Divider + Tour Selection */}
            <div className="absolute top-[150px] left-[30px] w-[500px] flex items-center justify-between">
                {/* 🎶 Would Go Again */}
                <div className="flex flex-col items-center text-center text-white text-3xl font-semibold">
                    <strong>{goAgain}</strong>
                    <span className="text-lg">Would go Again</span>
                </div>

                {/* Vertical Divider */}
                <div className="border-l-2 border-white h-[100px]"></div>

                {/* 🔽 Tour Selection Dropdown */}
                <select
                    className="w-[250px] h-[50px] bg-white bg-opacity-50 text-white text-lg rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
                    value={selectedTour}
                    onChange={changeTourFunc}
                >
                    <option value="All Tours">All Tours</option>
                    {artist.tours.map((tour, index) => (
                        <option key={index} value={tour.name}>{tour.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );


}


export default ArtistBanner