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
        
        if (!storedUser || !token) {
            navigate('/');
            return;
        }

        setUser(JSON.parse(storedUser));
        fetchUserConcerts(token);
    }, [navigate]);

    const fetchUserConcerts = async (token) => {
        try {
            const response = await fetch('http://localhost:3000/api/postgres/user-concerts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user concerts');
            }

            const data = await response.json();
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
                                className="border-b border-gray-700 pb-4 hover:bg-gray-700 p-4 rounded-lg transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-purple-400">{concert.artist_name}</h3>
                                        <p className="text-gray-400">{concert.venue_name}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(concert.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {concert.review && (
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span>{concert.review.rating}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
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