/**
 * 
 * This component renders the main concert discovery homepage with a comprehensive set of
 * features for browsing, filtering, and interacting with concert listings.
 * 
 * It includes:
 * - A responsive search and filter system for concert discovery
 * - Visual category cards for quick filtering (Upcoming Shows, Popular Artists, etc.)
 * - A paginated grid display of concert cards with dynamic filtering
 * - Multiple modal components for authentication, filters, concert details, and uploads
 * - Dark/light mode toggle with persistent user preferences
 * - Loading and error states with appropriate visual feedback
 * 
 * The component manages concert data fetching, user authentication state, and filter logic.
 * It implements pagination for large result sets and provides category-based quick filters
 * with visual indicators. The interface adapts to different screen sizes and maintains
 * consistent styling across both light and dark modes.
 */



import React, { useState, useEffect } from 'react';
import ConcertCard from '../components/ConcertCard';
import ConcertModal from '../components/ConcertModal';
import AuthModal from '../components/AuthModal';
import UploadConcertModal from '../components/UploadConcertModal';
import { Calendar, Star, MapPin, Ticket, Music, TrendingUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import NavBar from '../components/NavBar';
import { initDarkMode } from '../utils/themeUtils';

const Home = ({ navigateToArtist }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(initDarkMode());
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const concertsPerPage = 9;

  // Check for existing user session
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch concerts
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/postgres/concert-details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          console.error('Response status:', response.status);
          const errorText = await response.text();
          console.error('Response text:', errorText);
          throw new Error('Failed to fetch concerts');
        }
        const data = await response.json();
        console.log('Fetched concerts:', data);
        setConcerts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching concerts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleUploadSuccess = () => {
    fetchConcerts();
    setIsUploadModalOpen(false);
  };

  const categories = [
    { 
      id: 'upcoming', 
      name: 'Upcoming Shows', 
      icon: Calendar, 
      color: 'from-blue-500 to-purple-500',
      filter: (concert) => {
        const concertDate = new Date(concert.date);
        const today = new Date();
        return concertDate > today;
      }
    },
    { 
      id: 'trending', 
      name: 'Popular Artists', 
      icon: TrendingUp, 
      color: 'from-pink-500 to-rose-500', 
      filter: (concert) => true // We'll show all concerts for now,but ideally would be based on popularity
    },
    { 
      id: 'today', 
      name: 'Today\'s Shows', 
      icon: Clock, 
      color: 'from-green-500 to-emerald-500',
      filter: (concert) => {
        const concertDate = new Date(concert.date).toDateString();
        const today = new Date().toDateString();
        return concertDate === today;
      }
    },
    { 
      id: 'affordable', 
      name: 'Budget Friendly', 
      icon: Ticket, 
      color: 'from-amber-500 to-orange-500',
      filter: (concert) => parseFloat(concert.price) <= 50
    }
  ];

  // Filter concerts based on search term and active category
  const filteredConcerts = concerts.filter(concert => {
    const matchesSearch = concert.artist_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
      (categories.find(cat => cat.id === activeCategory)?.filter(concert) ?? true);
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredConcerts.length / concertsPerPage);
  const startIndex = (currentPage - 1) * concertsPerPage;
  const endIndex = startIndex + concertsPerPage;
  const currentConcerts = filteredConcerts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} user={user} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-xl">Loading concerts...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} user={user} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-500">Error Loading Concerts</h2>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <NavBar 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        user={user}
        onLogout={handleLogout}
        onLogin={() => setIsAuthModalOpen(true)}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            placeholder="Search concerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(activeCategory === category.id ? 'all' : category.id)}
              className={`relative rounded-xl overflow-hidden cursor-pointer group h-32 bg-gradient-to-br ${category.color}
                ${activeCategory === category.id ? 'ring-4 ring-purple-500 ring-opacity-50' : ''}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <category.icon className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-bold">{category.name}</h3>
                  {activeCategory === category.id && (
                    <span className="text-sm opacity-75">Active</span>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Concert Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentConcerts.length > 0 ? (
            currentConcerts.map(concert => (
              <ConcertCard
                key={concert.cid}
                concert={{
                  id: concert.cid,
                  artist: concert.artist_name,
                  tourName: concert.tour_name,
                  image_url: concert.image_url,
                  venue: concert.venue_name,
                  city: concert.city,
                  date: concert.date,
                  time: concert.time,
                  price: concert.price
                }}
                onClick={setSelectedConcert}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No concerts found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-2">
              {/* First page */}
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                1
              </button>

              {/* Ellipsis and middle pages */}
              {(() => {
                const pages = [];
                let startPage = Math.max(2, currentPage - 1);
                let endPage = Math.min(totalPages - 1, currentPage + 1);

                // Adjust if we're near the start
                if (currentPage <= 3) {
                  startPage = 2;
                  endPage = Math.min(4, totalPages - 1);
                }
                // Adjust if we're near the end
                if (currentPage >= totalPages - 2) {
                  startPage = Math.max(totalPages - 3, 2);
                  endPage = totalPages - 1;
                }

                if (startPage > 2) {
                  pages.push(
                    <span key="start-ellipsis" className="px-2 py-2">
                      ...
                    </span>
                  );
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === i
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                if (endPage < totalPages - 1) {
                  pages.push(
                    <span key="end-ellipsis" className="px-2 py-2">
                      ...
                    </span>
                  );
                }

                return pages;
              })()}

              {/* Last page */}
              {totalPages > 1 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      )}

      {selectedConcert && (
        <ConcertModal 
          concert={selectedConcert} 
          onClose={() => setSelectedConcert(null)} 
          navigateToArtist={navigateToArtist} 
        />
      )}

      {isUploadModalOpen && (
        <UploadConcertModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default Home;