import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Music, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star 
} from 'lucide-react';

// Predefined tag options
const GENRE_TAGS = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Latin', 'R&B', 'Country', 'Jazz'];
const VENUE_TAGS = ['Stadium Show', 'Arena Show', 'Club Show', 'Theater Show', 'Festival'];

const UploadConcertModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    artist: '',
    tourName: '',
    venue: '',
    date: '',
    price: '',
    image: '',
    tags: [],
    rating: 0
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close the modal
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const resetForm = () => {
    setFormData({
      artist: '',
      tourName: '',
      venue: '',
      date: '',
      price: '',
      image: '',
      tags: [],
      rating: 0
    });
    setError('');
    setHoverRating(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStarClick = (value) => {
    setFormData(prev => ({
      ...prev,
      rating: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tags.length < 2) {
      setError('Please select both a genre and venue type');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/concerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          reviews: 0 
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to upload concert');
      }

      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div ref = {modalRef} className="relative w-full max-w-sm md:max-w-md mx-4 bg-gray-900 dark:bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-6 max-h-[80vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          Upload Concert
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Artist Name */}
          <div>
            <label className="block text-sm font-medium text-pink-400 mb-1">
              Artist Name
            </label>
            <div className="relative">
              <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                className="pl-10 w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                required
              />
            </div>
          </div>

          {/* Tour Name */}
          <div>
            <label className="block text-sm font-medium text-indigo-400 mb-1">
              Tour Name
            </label>
            <input
              type="text"
              name="tourName"
              value={formData.tourName}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
              required
            />
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium text-teal-400 mb-1">
              Venue
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="pl-10 w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-green-400 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="pl-10 w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                required
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-orange-400 mb-1">
              Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="pl-10 w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                placeholder="e.g., 150"
                min="0"
                required
              />
            </div>
          </div>

          {/* Rating Section */}
          <div>
            <label className="block text-sm font-medium text-yellow-400 mb-1">
              Rating (Optional)
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((value) => {
                // Decide star color based on hover vs. actual rating
                const fillColor =
                  hoverRating >= value
                    ? 'text-yellow-300'     // Lighter gold on hover
                    : formData.rating >= value
                    ? 'text-yellow-400'     // Clicked (selected)
                    : 'text-gray-600';      // Unselected
                return (
                  <Star
                    key={value}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleStarClick(value)}
                    className={`w-6 h-6 cursor-pointer transition-colors ${fillColor}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Concert Image */}
          <div>
            <label className="block text-sm font-medium text-purple-400 mb-1">
              Concert Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-fuchsia-400 mb-1">
              Genre (Required)
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) addTag(e.target.value);
              }}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
              defaultValue=""
              required
            >
              <option value="" disabled>Select a genre...</option>
              {GENRE_TAGS.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Venue Type */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-1">
              Venue Type (Required)
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) addTag(e.target.value);
              }}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
              defaultValue=""
              required
            >
              <option value="" disabled>Select a venue type...</option>
              {VENUE_TAGS.map(venue => (
                <option key={venue} value={venue}>{venue}</option>
              ))}
            </select>
          </div>

          {/* Selected Tags Display */}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-700 text-blue-100 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-blue-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 mt-4"
          >
            <Upload className="w-5 h-5" />
            <span>{isLoading ? 'Uploading...' : 'Upload Concert'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadConcertModal;
