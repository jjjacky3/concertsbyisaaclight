/**
 * 
 * This component renders the artist summary page for any given artists including the artist's total rating and review metrics,
 * avaliable concerts and tours and comparsion tool.
 * 
 * It includes:
 * - Automatically updated total rating averaging all ratings of user reviews for thier concerts
 * - Automatic updated would go again providng a percentage ratings above 3 starts
 * - List of all concerts avaliable on the website under the artist
 * - List of all tours and ability to sort concerts by tours
 * - Rating module displaying number of reviews for each rating category with bar line
 * - Comparision module to drag and compare two of the aritst's concerts in categories such as: (costs, rating, setlist)
 * - Concert cards can be clicked to open the expanded concert view to add the concert to favourates, wishlist or share
 * - Module to view all written reviews for the artists
 */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from '../components/NavBar';
import ArtistBanner from "../components/ArtistBanner";
import ConcertItem from "../components/ConcertItem";
import RatingModule from "../components/RatingModule";
import CompareModule from "../components/CompareModule";
import ConcertExpandedView from "../components/ConcertExpandView";
import AuthModal from '../components/AuthModal';
import { Loader2, MessageCircle, User, Calendar, Star } from "lucide-react";
import ConcertCard from "../components/ConcertCard";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ArtistPage = () => {
  // Extract artistId from URL path
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();
  const [selectedTour, setSelectedTour] = useState("All Tours");
  const [concertsShown, setConcertsShown] = useState([]);
  const [ratingsDisplayed, setRatingsDisplayed] = useState({});
  const [comparedConcertOne, setComparedConcertOne] = useState(null);
  const [comparedConcertTwo, setComparedConcertTwo] = useState(null);
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const navigate = useNavigate();

  // Retrieve logged-in user from localStorage
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // State for authentication modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Fetch User Data / Login status
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    console.log('Stored user:', storedUser);
    console.log('Token exists:', !!token);

    if (!storedUser || !token) {
      console.log('No user or token found, redirecting to home');
      navigate('/');
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);


  // Fetch artist data based on artistId
  useEffect(() => {

    const fetchArtistData = async () => {
      if (!artistId) return;

      setLoading(true);
      setError(null);

      try {
        // Normalize artistId to match database format
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
            const simulatedRating = Math.max(1, Math.min(5, Math.round(concert.price / 30)));
            ratingsDistribution[simulatedRating]++;
          });

          // Create artist object with all necessary data
          const artistData = {
            name: normalizedArtistName,
            image: artistConcerts[0].image_url || "https://via.placeholder.com/1200x300",
            ratings: ratingsDistribution,
            goAgain: 85,
            tours: tours,
            concerts: artistConcerts.map(concert => ({
              id: concert.cid,
              name: `${concert.artist_name} at ${concert.venue_name}`,
              date: new Date(concert.date).toLocaleDateString(),
              city: concert.city,
              rating: (Math.random() * 2 + 3).toFixed(1),
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

          setArtist(artistData);
          setConcertsShown(artistData.concerts);
          setRatingsDisplayed(artistData.ratings);
          setReviews([]);
        } else {
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
              artist: concert.artist_name,
              tourName: concert.tour_name,
              // date: new Date(concert.date).toLocaleDateString(),
              date: concert.date,
              time: concert.time,
              city: concert.city,
              rating: calculateConcertAvgRating(reviewsData.data.reviews, concert.cid),
              price: concert.price,
              desc: `Experience ${concert.artist_name} live at ${concert.venue_name} in ${concert.city}`,
              tour: { name: concert.tour_name },
              image_url: concert.image_url
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

  const calculateConcertAvgRating = (reviews, concertId) => {
    if (!reviews || reviews.length === 0) return (3.5).toFixed(1);
    const concertReviews = reviews.filter(review => review.cid === concertId);
    if (concertReviews.length === 0) return (3.5).toFixed(1);
    const total = concertReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / concertReviews.length).toFixed(1);
  };

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

  const toggleReviewsSection = () => {
    setShowReviews(!showReviews);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar
          user={user}
          onLogin={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar
          user={user}
          onLogin={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} relative`}>
      <NavBar
        user={user}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      <ArtistBanner artist={artist} selectedTour={selectedTour} changeTourFunc={handleChange} />
      <div className="flex justify-center space-x-6 p-6 relative">
        <div className={`w-[700px] h-[800px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-y-auto p-4 grid grid-cols-2 gap-4`}>
          {concertsShown.map((concert) => (
            <div
              key={concert.cid}
              className="self-start">
              <ConcertCard
                concert={concert}
                onClick={setSelectedConcert}
              />
            </div>
          ))}
        </div>
        {selectedConcert && (
          <ConcertExpandedView
            concert={selectedConcert}
            closeOverlay={closeOverlay}
          />
        )}
        <div className="w-[750px] flex flex-col space-y-6">
          <div className={`h-[400px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl`}>
            <RatingModule ratings={ratingsDisplayed} />
          </div>
          <div className={`h-[380px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl`}>
            <CompareModule
              concert1={comparedConcertOne}
              concert2={comparedConcertTwo}
              onDropConcert={handleConcertDrop}
              setConcertOne={setComparedConcertOne}
              setConcertTwo={setComparedConcertTwo}
            />
          </div>
          {reviews.length > 0 && (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl`}>
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
      {/* Render AuthModal with isOpen prop */}
      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
};

export default ArtistPage;
