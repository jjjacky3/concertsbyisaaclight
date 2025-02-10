import React, { useState, useEffect } from 'react';
import SideNavigation from '../components/SideNavigation';
import ConcertCard from '../components/ConcertCard';
import ConcertModal from '../components/ConcertModal';
import FilterModal from '../components/FilterModal';
import { Filter, Menu, Sun, Moon, Timer, TrendingUp, Users, MapPin } from 'lucide-react';

const Home = () => {
  const [activeGenre, setActiveGenre] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Use an effect to add or remove the "dark" class on the document's root element.
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const categories = [
    { id: 1, name: 'Live Tonight', icon: Timer, color: 'from-red-500 to-orange-500' },
    { id: 2, name: 'Trending Tours', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { id: 3, name: 'Festivals', icon: Users, color: 'from-green-500 to-teal-500' },
    { id: 4, name: 'Local Venues', icon: MapPin, color: 'from-blue-500 to-indigo-500' }
  ];

  const concerts = [
    {
      id: 1,
      artist: 'Taylor Swift',
      tourName: 'Eras Tour',
      venue: 'SoFi Stadium',
      date: 'Aug 5',
      price: '$199+',
      rating: 4.9,
      reviews: 2453,
      image: '/api/placeholder/400/300',
      tags: ['Pop', 'Stadium Show']
    },
    {
      id: 2,
      artist: 'The Weeknd',
      tourName: 'After Hours Tour',
      venue: 'Madison Square Garden',
      date: 'Sept 15',
      price: '$150+',
      rating: 4.7,
      reviews: 1829,
      image: '/api/placeholder/400/300',
      tags: ['R&B', 'Arena Show']
    },
    {
      id: 3,
      artist: 'Bad Bunny',
      tourName: 'Most Wanted Tour',
      venue: 'T-Mobile Arena',
      date: 'Oct 1',
      price: '$175+',
      rating: 4.8,
      reviews: 2105,
      image: '/api/placeholder/400/300',
      tags: ['Latin', 'Arena Show']
    }
  ];

  // Filter concerts based on the search term and selected genre.
  const filteredConcerts = concerts.filter(concert => {
    const matchesSearch =
      concert.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concert.tourName.toLowerCase().includes(searchTerm.toLowerCase());
    const isGenreFilter = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Latin', 'R&B', 'Country', 'Jazz'].includes(activeGenre);
    const matchesGenre = isGenreFilter ? concert.tags.includes(activeGenre) : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Hamburger menu (mobile only) */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Discover Concerts</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search concerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            aria-label="Search concerts"
          />
          {/* Filter button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          {/* Dark mode toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar for desktop */}
        <aside className="w-64 flex-shrink-0 hidden md:block p-4">
          <SideNavigation activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
        </aside>

        {/* Mobile Sidebar Modal */}
        {showSidebar && (
          <div className="fixed inset-0 z-40 flex">
            <div className="w-64 bg-white dark:bg-gray-800 p-4">
              <SideNavigation activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
            </div>
            <div className="flex-1" onClick={() => setShowSidebar(false)} />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 space-y-8">
          {/* Featured Categories */}
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

          {/* Concert Grid */}
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

      {/* Concert Detail Modal */}
      {selectedConcert && (
        <ConcertModal concert={selectedConcert} onClose={() => setSelectedConcert(null)} />
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && <FilterModal onClose={() => setIsFilterModalOpen(false)} />}
    </div>
  );
};

export default Home;
