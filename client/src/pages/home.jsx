import React, { useState } from 'react';
import { Calendar, MapPin, Timer, Star, Music, Ticket, TrendingUp, Users, Heart, Share2, Filter } from 'lucide-react';

const HomePage = () => {
  const [activeGenre, setActiveGenre] = useState('All');
  
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

  const SideNavigation = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-white">Discover</h3>
        <ul className="space-y-2">
          {['All', 'New Tours', 'Recommended', 'Nearby', 'Following'].map(item => (
            <li 
              key={item}
              onClick={() => setActiveGenre(item)}
              className={`cursor-pointer flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-gray-700
                ${activeGenre === item ? 'bg-gray-700 font-medium' : ''}`}
            >
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-white">Genres</h3>
        <ul className="space-y-2">
          {['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Latin', 'R&B', 'Country', 'Jazz'].map(genre => (
            <li 
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`cursor-pointer flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-gray-700
                ${activeGenre === genre ? 'bg-gray-700 font-medium' : ''}`}
            >
              <Music className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300">{genre}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const ConcertCard = ({ concert }) => (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative group">
        <img src={concert.image} alt={concert.artist} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-4">
            <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600">
              <Heart className="w-6 h-6 text-red-500" />
            </button>
            <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600">
              <Share2 className="w-6 h-6 text-blue-500" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-white">{concert.artist}</h3>
            <p className="text-sm text-gray-400">{concert.tourName}</p>
          </div>
          <div className="flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-white">{concert.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{concert.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{concert.venue}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {concert.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Ticket className="w-4 h-4 text-green-500" />
            <span className="font-medium text-green-500">{concert.price}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex space-x-8">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <SideNavigation />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Top Filter Bar */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Discover Concerts</h1>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Featured Categories */}
            <div className="grid grid-cols-4 gap-4">
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
            <div className="grid grid-cols-3 gap-6">
              {concerts.map(concert => (
                <ConcertCard key={concert.id} concert={concert} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
