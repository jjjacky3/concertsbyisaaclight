import React, { useState, useEffect } from 'react';
import ConcertCard from '../components/ConcertCard';
import ConcertModal from '../components/ConcertModal';
import FilterModal from '../components/FilterModal';
import AuthModal from '../components/AuthModal';
import UploadConcertModal from '../components/UploadConcertModal';
import { Filter, Calendar, Star, MapPin, Ticket, Music, TrendingUp, Clock } from 'lucide-react';
import NavBar from '../components/NavBar';

const Home = ({ navigateToArtist }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 1000],
    distance: 50,
    minRating: 0,
    dateRange: 'all',
    venueTypes: []
  });

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

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
      filter: (concert) => true // We'll show all concerts for now, but ideally would be based on popularity
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

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setIsFilterModalOpen(false);
  };

  // Filter concerts based on search term, active category, and filters
  const filteredConcerts = concerts.filter(concert => {
    const matchesSearch = concert.artist_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
      (categories.find(cat => cat.id === activeCategory)?.filter(concert) ?? true);
    const price = parseFloat(concert.price);
    const matchesPrice = price >= activeFilters.priceRange[0] && price <= activeFilters.priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

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
        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            placeholder="Search concerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          />
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Filter className="w-5 h-5" />
          </button>
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
          {filteredConcerts.length > 0 ? (
            filteredConcerts.map(concert => (
              <ConcertCard
                key={concert.cid}
                concert={{
                  id: concert.cid,
                  artist: concert.artist_name,
                  tourName: concert.tour_name,
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
            <div className="col-span-full text-center py-8">
              <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-500">No concerts found matching your criteria</p>
            </div>
          )}
        </div>
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

      {isFilterModalOpen && (
        <FilterModal 
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          currentFilters={activeFilters}
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