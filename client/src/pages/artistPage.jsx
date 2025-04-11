import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from '../components/NavBar';
import ArtistBanner from "../components/ArtistBanner";
import ConcertItem from "../components/ConcertItem";
import RatingModule from "../components/RatingModule";
import CompareModule from "../components/CompareModule";
import ConcertExpandedView from "../components/ConcertExpandView";
import { Loader2, MessageCircle, User, Calendar, Star } from "lucide-react";

const ArtistPage = () => {
  // Extract artistId from URL path
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedTour, setSelectedTour] = useState("All Tours");
  const [concertsShown, setConcertsShown] = useState([]);
  const [ratingsDisplayed, setRatingsDisplayed] = useState({});
  const [comparedConcertOne, setComparedConcertOne] = useState(null);
  const [comparedConcertTwo, setComparedConcertTwo] = useState(null);
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch artist data based on artistId
  useEffect(() => {
    const fetchArtistData = async () => {
      if (!artistId) return;

      setLoading(true);
      setError(null);

      try {
        // Normalize artistId to match database format (convert slug to proper name format)
        const normalizedArtistName = artistId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        // Fetch concerts for this artist
        const concertsResponse = await fetch(`http://localhost:3000/api/postgres/concert-details`);
        if (!concertsResponse.ok) throw new Error('Failed to fetch concert data');

        const allConcertsData = await concertsResponse.json();

        // Filter concerts for this artist
        const artistConcerts = allConcertsData.filter(
          concert => concert.artist_name.toLowerCase() === normalizedArtistName.toLowerCase()
        );

        if (artistConcerts.length === 0) {
          throw new Error(`No concerts found for artist: ${normalizedArtistName}`);
        }

        // Get unique tours from concerts
        const tours = [...new Set(artistConcerts.map(concert => concert.tour_name))].map(tourName => ({
          name: tourName
        }));

        // Fetch artist reviews
        const reviewsResponse = await fetch(`http://localhost:3000/api/postgres/artist-reviews/${artistId}`);

        if (!reviewsResponse.ok) {
          console.warn('Could not fetch artist reviews, using simulated data');

          // Calculate ratings distribution (1-5 stars) - using simulation as fallback
          const ratingsDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          artistConcerts.forEach(concert => {
            // If we had actual ratings in the database, we would use those
            // For now, we'll simulate some ratings based on concert price
            const simulatedRating = Math.max(1, Math.min(5, Math.round(concert.price / 30)));
            ratingsDistribution[simulatedRating]++;
          });

          // Create artist object with all necessary data
          const artistData = {
            name: normalizedArtistName,
            image: artistConcerts[0].image_url || "https://via.placeholder.com/1200x300",
            ratings: ratingsDistribution,
            goAgain: 85, // This would come from actual data in a real implementation
            tours: tours,
            concerts: artistConcerts.map(concert => ({
              id: concert.cid,
              name: `${concert.artist_name} at ${concert.venue_name}`,
              date: new Date(concert.date).toLocaleDateString(),
              city: concert.city,
              rating: (Math.random() * 2 + 3).toFixed(1), // Simulate a rating between 3.0-5.0
              price: concert.price,
              desc: `Experience ${concert.artist_name} live at ${concert.venue_name} in ${concert.city}`,
              tour: { name: concert.tour_name },
              image: concert.image_url
            })),
            avgRating: function () {
              const total = Object.entries(this.ratings).reduce(
                (sum, [rating, count]) => sum + (Number(rating) * count), 0
              );
              const count = Object.values(this.ratings).reduce((sum, count) => sum + count, 0);
              return count > 0 ? (total / count).toFixed(1) : "N/A";
            },
            findTour: function (tourName) {
              if (tourName === "All Tours") return this.ratings;

              // Filter concerts by tour and calculate rating distribution
              const tourConcerts = this.concerts.filter(c => c.tour.name === tourName);
              const tourRatings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

              tourConcerts.forEach(concert => {
                const rating = Math.round(parseFloat(concert.rating));
                tourRatings[rating] = (tourRatings[rating] || 0) + 1;
              });

              return tourRatings;
            }
          };

          // Set state with the artist data
          setArtist(artistData);
          setConcertsShown(artistData.concerts);
          setRatingsDisplayed(artistData.ratings);
          setReviews([]);
        } else {
          // Process real review data
          const reviewsData = await reviewsResponse.json();
          console.log('Artist reviews:', reviewsData);

          // Create artist object with real review data
          const artistData = {
            name: normalizedArtistName,
            image: artistConcerts[0].image_url || "https://via.placeholder.com/1200x300",
            ratings: reviewsData.data.ratingDistribution,
            goAgain: reviewsData.data.goAgain,
            tours: tours,
            concerts: artistConcerts.map(concert => ({
              id: concert.cid,
              name: `${concert.artist_name} at ${concert.venue_name}`,
              date: new Date(concert.date).toLocaleDateString(),
              city: concert.city,
              rating: calculateConcertAvgRating(reviewsData.data.reviews, concert.cid),
              price: concert.price,
              desc: `Experience ${concert.artist_name} live at ${concert.venue_name} in ${concert.city}`,
              tour: { name: concert.tour_name },
              image: concert.image_url
            })),
            avgRating: function () {
              const total = Object.entries(this.ratings).reduce(
                (sum, [rating, count]) => sum + (Number(rating) * count), 0
              );
              const count = Object.values(this.ratings).reduce((sum, count) => sum + count, 0);
              return count > 0 ? (total / count).toFixed(1) : "N/A";
            },
            findTour: function (tourName) {
              if (tourName === "All Tours") return this.ratings;

              // Use real tour ratings if available
              if (reviewsData.data.tourRatings && reviewsData.data.tourRatings[tourName]) {
                return reviewsData.data.tourRatings[tourName];
              }

              // Fallback method
              const tourConcerts = this.concerts.filter(c => c.tour.name === tourName);
              const tourRatings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

              tourConcerts.forEach(concert => {
                const rating = Math.round(parseFloat(concert.rating));
                tourRatings[rating] = (tourRatings[rating] || 0) + 1;
              });

              return tourRatings;
            }
          };

          // Set state with the artist data
          setArtist(artistData);
          setConcertsShown(artistData.concerts);
          setRatingsDisplayed(artistData.ratings);
          setReviews(reviewsData.data.reviews);
        }

        setLoading(false);

      } catch (err) {
        console.error('Error fetching artist data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  // Helper function to calculate average rating for a concert
  const calculateConcertAvgRating = (reviews, concertId) => {
    if (!reviews || reviews.length === 0) return (3.5).toFixed(1);

    const concertReviews = reviews.filter(review => review.cid === concertId);
    if (concertReviews.length === 0) return (3.5).toFixed(1);

    const total = concertReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / concertReviews.length).toFixed(1);
  };

  // Update displayed concerts when selected tour changes
  useEffect(() => {
    if (!artist) return;

    if (selectedTour === "All Tours") {
      setConcertsShown(artist.concerts);
      setRatingsDisplayed(artist.ratings);
    } else {
      setConcertsShown(artist.concerts.filter(concert => concert.tour.name === selectedTour));
      setRatingsDisplayed(artist.findTour(selectedTour));
    }
  }, [selectedTour, artist]);

  const handleChange = (event) => {
    setSelectedTour(event.target.value);
  };

  const concertItemClicked = (concert) => {
    setSelectedConcert(concert);
  };

  const closeOverlay = () => {
    setSelectedConcert(null);
  };

  const handleConcertDrop = (concert, side) => {
    if (side === 'left') {
      setComparedConcertOne(concert);
    } else if (side === 'right') {
      setComparedConcertTwo(concert);
    }
  };

  // Toggle reviews section visibility
  const toggleReviewsSection = () => {
    setShowReviews(!showReviews);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            <div className="text-xl">Loading artist information...</div>
            <div className="text-gray-400">Please wait while we fetch the data</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-500">Error Loading Artist</h2>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show artist page if data is loaded
  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Navbar */}
      <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Artist Banner */}
      <ArtistBanner artist={artist} selectedTour={selectedTour} changeTourFunc={handleChange} />

      {/* Page Layout */}
      <div className="flex justify-center space-x-6 p-6 relative">
        {/* Concert List Container */}
        <div className="w-[700px] h-[800px] bg-gray-800 rounded-lg shadow-lg overflow-y-auto p-4 
            grid grid-cols-2 gap-4">
          {concertsShown.map((concert, index) => (
            <ConcertItem
              key={index}
              concert={concert}
              clickItemFunc={concertItemClicked}
              isSelected={concert === comparedConcertOne || concert === comparedConcertTwo}
            />
          ))}
        </div>

        {/* Overlay Panel */}
        {selectedConcert && (
          <ConcertExpandedView
            concert={selectedConcert}
            closeOverlay={closeOverlay}
          />
        )}

        {/* Right Side Content (Ratings & Comparison) */}
        <div className="w-[750px] flex flex-col space-y-6">
          {/* Rating Module */}
          <div className="h-[400px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl">
            <RatingModule ratings={ratingsDisplayed} />
          </div>

          {/* Compare Module */}
          <div className="h-[380px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl">
            <CompareModule
              concert1={comparedConcertOne}
              concert2={comparedConcertTwo}
              onDropConcert={handleConcertDrop}
              setConcertOne={setComparedConcertOne}
              setConcertTwo={setComparedConcertTwo}
            />
          </div>

          {/* Show User Reviews Button */}
          {reviews.length > 0 && (
            <div className="bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl">
              <button
                onClick={toggleReviewsSection}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{showReviews ? 'Hide Fan Reviews' : 'Show Fan Reviews'}</span>
                <span className="ml-2 bg-purple-800 rounded-full px-2 py-1 text-xs">
                  {reviews.length}
                </span>
              </button>

              {/* Reviews Section */}
              {showReviews && (
                <div className="mt-6 max-h-[500px] overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">Fan Reviews</h3>

                  {reviews.map((review, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-600 mr-3 flex items-center justify-center">
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-semibold">{review.user_fname} {review.user_lname}</div>
                            <div className="text-gray-400 text-sm flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(review.date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center bg-gray-800 px-2 py-1 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                          <span>{review.rating}</span>
                        </div>
                      </div>

                      {review.review_text && (
                        <p className="text-gray-300">{review.review_text}</p>
                      )}

                      <div className="mt-2 text-sm text-gray-400">
                        <span className="font-semibold">{review.tour_name}</span> at {review.venue_name}, {review.venue_city}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;