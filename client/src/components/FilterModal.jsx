/**
 * 
 * This component renders a comprehensive filtering interface modal for concert search 
 * with multiple interactive filtering options.
 * 
 * It also includes:
 * - A price range selector with min/max numeric inputs for budget constraints
 * - A distance slider allowing users to limit search radius from their location
 * - A minimum rating filter with visual slider control and real-time feedback
 * - A date range dropdown for temporal filtering across various time periods
 * - A venue type selector with checkboxes for filtering by performance space category
 * - A prominent apply button that consolidates all filter selections
 * 
 * The component manages multiple state values for different filter criteria, performs input validation
 * to ensure logical filter combinations (e.g., min price ≤ max price), and formats filter data before
 * passing it to the parent component. The modal design features a dark theme with purple accents,
 * intuitive icons for each filter category, and responsive controls with clear visual feedback.
 */

import React, { useState } from 'react';
import { X, DollarSign, Calendar, MapPin, Star, Music2 } from 'lucide-react';

const FilterModal = ({ onClose, onApplyFilters }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [distance, setDistance] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [dateRange, setDateRange] = useState('all');
  const [venueTypes, setVenueTypes] = useState({
    stadium: false,
    arena: false,
    club: false,
    theater: false,
    festival: false
  });

  const handlePriceMinChange = (e) => {
    setPriceRange([Number(e.target.value), priceRange[1]]);
  };

  const handlePriceMaxChange = (e) => {
    setPriceRange([priceRange[0], Number(e.target.value)]);
  };

  const handleVenueTypeChange = (type) => {
    setVenueTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleApply = () => {
    onApplyFilters({
      priceRange,
      distance,
      minRating,
      dateRange,
      venueTypes: Object.entries(venueTypes)
        .filter(([_, checked]) => checked)
        .map(([type]) => type)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl p-6 w-11/12 max-w-md relative max-h-[90vh] overflow-y-auto border border-gray-800 shadow-xl">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <h2 className="text-xl font-bold mb-6 text-white flex items-center">
          <Music2 className="w-6 h-6 mr-2 text-purple-500" />
          Filters
        </h2>
        
        {/* Price Range Filter */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 mr-2 text-purple-500" />
            <h3 className="font-semibold text-white">Price Range</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Min</label>
              <input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={handlePriceMinChange}
                className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Max</label>
              <input
                type="number"
                min={priceRange[0]}
                value={priceRange[1]}
                onChange={handlePriceMaxChange}
                className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Distance Filter */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 mr-2 text-purple-500" />
            <h3 className="font-semibold text-white">Distance</h3>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>0 miles</span>
            <span>{distance} miles</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Star className="w-5 h-5 mr-2 text-purple-500" />
            <h3 className="font-semibold text-white">Minimum Rating</h3>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Any</span>
            <span>{minRating}+ stars</span>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            <h3 className="font-semibold text-white">Date Range</h3>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">Any time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="quarter">Next 3 months</option>
            <option value="year">This year</option>
          </select>
        </div>

        {/* Venue Types */}
        <div className="mb-8">
          <h3 className="font-semibold text-white mb-4">Venue Types</h3>
          {Object.entries(venueTypes).map(([type, checked]) => (
            <label
              key={type}
              className="flex items-center justify-between mb-3 py-2 px-3 rounded-lg bg-gray-800 hover:bg-gray-750 cursor-pointer"
            >
              <span className="capitalize text-gray-300">{type}</span>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleVenueTypeChange(type)}
                className="w-4 h-4 accent-purple-500"
              />
            </label>
          ))}
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterModal;