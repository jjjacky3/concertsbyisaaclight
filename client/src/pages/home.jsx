import React, { useState, useEffect } from 'react';
import SideNavigation from '../components/SideNavigation';
import ConcertCard from '../components/ConcertCard';
import ConcertModal from '../components/ConcertModal';
import FilterModal from '../components/FilterModal';
import AuthModal from '../components/AuthModal';
import { Filter, Menu, Sun, Moon, Timer, TrendingUp, Users, MapPin, LogIn, LogOut } from 'lucide-react';
import beyonceImage from './homeimages/carter.jpeg'
import thuyImage from './homeimages/thuy.jpg'
import duaImage from './homeimages/dua.jpg'

const Home = () => {
  const [activeGenre, setActiveGenre] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
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

  // Rest of your existing constants (categories, concerts)
  const categories = [
    { id: 1, name: 'Live Tonight', icon: Timer, color: 'from-red-500 to-orange-500' },
    { id: 2, name: 'Trending Tours', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { id: 3, name: 'Festivals', icon: Users, color: 'from-green-500 to-teal-500' },
    { id: 4, name: 'Local Venues', icon: MapPin, color: 'from-blue-500 to-indigo-500' }
  ];

  const concerts = [
    // Your existing concerts array
    {
      id: 1,
      artist: 'Beyoncé',
      tourName: 'Cowboy Carter Tour',
      venue: 'Mercedes‑Benz Stadium',
      date: 'Jul 10–11',
      price: '210',
      rating: 4.9,
      reviews: 2453,
      image: beyonceImage,
      tags: ['Pop', 'Stadium Show']
    },
    {
      id: 2,
      artist: 'Dua Lipa',
      tourName: 'Future Nostalgia Tour',
      venue: 'State Farm Arena',
      date: 'Sept 13–14',
      price: '211',
      rating: 4.7,
      reviews: 1829,
      image: duaImage,
      tags: ['Pop', 'Arena Show']
    },
    {
      id: 3,
      artist: 'THUY',
      tourName: 'THUY Live',
      venue: 'Center Stage Atlanta',
      date: 'Feb 12',
      price: '60',
      rating: 4.6,
      reviews: 1100,
      image: thuyImage,
      tags: ['Pop', 'Indie', 'R&B']
    }
  ];

  // Your existing filter functions
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setIsFilterModalOpen(false);
  };

  const filteredConcerts = concerts.filter(concert => {
    // Your existing filter logic
    const matchesSearch =
      concert.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concert.tourName.toLowerCase().includes(searchTerm.toLowerCase());

    const isGenreFilter = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Latin', 'R&B', 'Country', 'Jazz'].includes(activeGenre);
    const matchesGenre = isGenreFilter ? concert.tags.includes(activeGenre) : true;

    const price = parseFloat(concert.price);
    const matchesPrice = price >= activeFilters.priceRange[0] && price <= activeFilters.priceRange[1];

    const matchesRating = concert.rating >= activeFilters.minRating;

    const matchesVenueType = activeFilters.venueTypes.length === 0 || 
      concert.tags.some(tag => activeFilters.venueTypes.includes(tag.toLowerCase()));

    return matchesSearch && matchesGenre && matchesPrice && matchesRating && matchesVenueType;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">OnlyConcerts</h1>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search concerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            aria-label="Search concerts"
          />
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          
          {/* Auth Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Rest of your existing JSX */}
      <div className="flex">
        <aside className="w-64 flex-shrink-0 hidden md:block p-4">
          <SideNavigation activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
        </aside>

        {showSidebar && (
          <div className="fixed inset-0 z-40 flex">
            <div className="w-64 bg-white dark:bg-gray-800 p-4">
              <SideNavigation activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
            </div>
            <div className="flex-1" onClick={() => setShowSidebar(false)} />
          </div>
        )}

        <main className="flex-1 p-4 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className={`relative rounded-xl overflow-hidden cursor-pointer group h-32 bg-gradient-to-br ${category.color}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <category.icon className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-bold">{category.name}</h3>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredConcerts.map(concert => (
              <ConcertCard
                key={concert.id}
                concert={concert}
                onClick={(concert) => setSelectedConcert(concert)}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Modals */}
      {selectedConcert && (
        <ConcertModal concert={selectedConcert} onClose={() => setSelectedConcert(null)} />
      )}

      {isFilterModalOpen && (
        <FilterModal 
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Home;