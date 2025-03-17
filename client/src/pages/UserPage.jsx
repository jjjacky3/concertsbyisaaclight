import React, { useState, useEffect } from "react";
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Star, Heart, Settings, LogOut, Loader2 } from 'lucide-react';

const UserPage = () => {
    const [user, setUser] = useState(null);
    const [userConcerts, setUserConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const navigate = useNavigate();

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
        fetchUserConcerts(token);
    }, [navigate]);

    const fetchUserConcerts = async (token) => {
        try {
            console.log('Fetching concerts with token:', token);
            const response = await fetch('http://localhost:3000/api/postgres/user-concerts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (!response.ok) {
                throw new Error('Failed to fetch user concerts');
            }

            const data = JSON.parse(responseText);
            console.log('Fetched concerts:', data);
            setUserConcerts(data);
        } catch (err) {
            console.error('Error fetching concerts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleRating = async (concertId, rating) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/postgres/concerts/${concertId}/rate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating })
            });

            if (!response.ok) throw new Error('Failed to update rating');

            // Update local state
            setUserConcerts(concerts => 
                concerts.map(c => 
                    c.cid === concertId 
                        ? { ...c, review: { ...c.review, rating } }
                        : c
                )
            );
        } catch (err) {
            console.error('Error updating rating:', err);
            // You might want to show an error toast here
        }
    };

    const handleToggleFavorite = async (concertId) => {
        try {
            const token = localStorage.getItem('token');
            const concert = userConcerts.find(c => c.cid === concertId);
            const newFavoriteStatus = !concert.favorite;

            const response = await fetch(`http://localhost:3000/api/postgres/concerts/${concertId}/favorite`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ favorite: newFavoriteStatus })
            });

            if (!response.ok) throw new Error('Failed to update favorite status');

            // Update local state
            setUserConcerts(concerts =>
                concerts.map(c =>
                    c.cid === concertId
                        ? { ...c, favorite: newFavoriteStatus }
                        : c
                )
            );
        } catch (err) {
            console.error('Error updating favorite status:', err);
            // You might want to show an error toast here
        }
    };

    const handleReviewText = async (concertId, text) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/postgres/concerts/${concertId}/review`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error('Failed to update review');

            // Update local state
            setUserConcerts(concerts =>
                concerts.map(c =>
                    c.cid === concertId
                        ? { ...c, review: { ...c.review, text } }
                        : c
                )
            );
        } catch (err) {
            console.error('Error updating review:', err);
            // You might want to show an error toast here
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white">
                <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} user={user} />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                        <div className="text-xl">Loading your profile...</div>
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
                        <h2 className="text-2xl font-bold text-red-500">Error Loading Profile</h2>
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
        <div className="min-h-screen bg-gray-900 text-white">
            <NavBar 
                isDarkMode={isDarkMode} 
                setIsDarkMode={setIsDarkMode} 
                user={user}
                onLogout={handleLogout}
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* User Profile Header */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user?.fname} {user?.lname}</h1>
                            <p className="text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-6 h-6 text-purple-500" />
                            <h2 className="text-xl font-semibold">Concerts Attended</h2>
                        </div>
                        <p className="text-3xl font-bold mt-2">{userConcerts.length}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
                        <div className="flex items-center space-x-2">
                            <Star className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-xl font-semibold">Reviews</h2>
                        </div>
                        <p className="text-3xl font-bold mt-2">
                            {userConcerts.filter(concert => concert.review).length}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
                        <div className="flex items-center space-x-2">
                            <Heart className="w-6 h-6 text-red-500" />
                            <h2 className="text-xl font-semibold">Favorites</h2>
                        </div>
                        <p className="text-3xl font-bold mt-2">
                            {userConcerts.filter(concert => concert.favorite).length}
                        </p>
                    </div>
                </div>

                {/* Concert History */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Concert History</h2>
                    <div className="space-y-4">
                        {userConcerts.map((concert, index) => (
                            <div 
                                key={index} 
                                className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-purple-400 text-lg">{concert.artist_name}</h3>
                                        <p className="text-gray-300">{concert.venue_name}, {concert.city}</p>
                                        <div className="flex items-center space-x-4 mt-1 text-gray-400">
                                            <p>{new Date(concert.date).toLocaleDateString()}</p>
                                            <p>{concert.time}</p>
                                            <p className="text-green-400">${concert.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {/* Rating Section */}
                                        <div className="flex items-center space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => handleRating(concert.cid, star)}
                                                    className={`focus:outline-none transition-colors ${
                                                        (concert.review?.rating || 0) >= star 
                                                            ? 'text-yellow-500' 
                                                            : 'text-gray-600 hover:text-yellow-400'
                                                    }`}
                                                >
                                                    <Star className="w-5 h-5" fill={concert.review?.rating >= star ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {/* Favorite Button */}
                                        <button
                                            onClick={() => handleToggleFavorite(concert.cid)}
                                            className={`focus:outline-none transition-colors ${
                                                concert.favorite ? 'text-red-500' : 'text-gray-600 hover:text-red-400'
                                            }`}
                                        >
                                            <Heart 
                                                className="w-6 h-6" 
                                                fill={concert.favorite ? "currentColor" : "none"} 
                                            />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Review Text Area - Only show if rated */}
                                {concert.review?.rating > 0 && (
                                    <div className="mt-3">
                                        <textarea
                                            placeholder="Add your thoughts about this concert..."
                                            value={concert.review?.text || ''}
                                            onChange={(e) => handleReviewText(concert.cid, e.target.value)}
                                            className="w-full bg-gray-800 text-white rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            rows="2"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {userConcerts.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">No concerts in your history yet</p>
                                <p className="text-sm">Concerts you attend will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        onClick={() => navigate('/settings')}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPage;