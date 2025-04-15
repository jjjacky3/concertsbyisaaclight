import React, { useState, useEffect } from "react";
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Star, Heart, Settings, LogOut, Loader2 } from 'lucide-react';
import WishListBubble from "../components/WishListBubble";
import { parse } from 'flatted';

const UserPage = () => {
    const [user, setUser] = useState(null);
    const [userConcerts, setUserConcerts] = useState([]);
    const [wishList, setWishList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedConcert, setSelectedConcert] = useState(null);
    const navigate = useNavigate();

    // Layout configuration for wish list bubbles
    const wishListBubbleLayoutKey = {
        0: [1.8, '280px', '200px'],
        1: [1.24, '45px', '183px'],
        2: [1.24, '470px', '340px'],
        3: [1.24, '380px', '40px'],
        4: [1, '170px', '30px'],
        5: [1, '-10px', '0px'],
        6: [1, '90px', '330px'],
        7: [1, '90px', '330px'],
        8: [1, '280px', '370px'],
        9: [1, '520px', '190px'],
        10: [1, '550px', '20px']
    };

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

    // Wishlist management functions from first version
    const editWishList = (command, concertData) => {
        if (command === "isIn") {
            // Check if we need to use id or cid based on the data structure
            const idProperty = concertData.cid !== undefined ? 'cid' : 'id';
            return wishList.some(item => item[idProperty] === concertData[idProperty]);
        }

        if (command === "add") {
            setWishList(prevList => {
                // Check if we need to use id or cid based on the data structure
                const idProperty = concertData.cid !== undefined ? 'cid' : 'id';
                const alreadyIn = prevList.some(item => item[idProperty] === concertData[idProperty]);
                if (alreadyIn) return prevList;
                const updatedList = [...prevList, concertData].sort((a, b) => new Date(a.date) - new Date(b.date));
                return updatedList;
            });
            return true;
        }

        if (command === "remove") {
            setWishList(prevList => {
                // Check if we need to use id or cid based on the data structure
                const idProperty = concertData.cid !== undefined ? 'cid' : 'id';
                return prevList.filter(item => item[idProperty] !== concertData[idProperty]);
            });
            return true;
        }

        return false;
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Required to allow dropping
    };

    const handleDrop = (e) => {
        e.preventDefault();
        try {
            const concertData = parse(e.dataTransfer.getData("concertData"));
            if (!editWishList("isIn", concertData)) {
                editWishList("add", concertData);
            } else {
                console.log("Concert already in wishlist.");
            }
        } catch (err) {
            console.error("Failed to parse concertData", err);
        }
    };

    const concertItemClicked = (concert) => {
        setSelectedConcert(concert);
    };

    const closeOverlay = () => {
        setSelectedConcert(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white">
                <NavBar user={user} />
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
                <NavBar user={user} />
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
            <NavBar user={user} onLogout={handleLogout} />
            
            {/* Overlay Panel */}
            {selectedConcert && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[600px] h-[400px] flex flex-col items-center justify-center">
                        {/* Pass necessary props for wishlist functionality */}
                        <ConcertExpandedView 
                            concert={selectedConcert} 
                            closeOverlay={closeOverlay}
                            editWishList={editWishList}
                            wishList={wishList}
                            favoriteClicked={handleToggleFavorite}
                            handleRating={handleRating}
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-center space-x-6 p-6 relative">
                <div className="w-[750px] flex flex-col space-y-6">
                    {/* User Profile */}
                    <div className="h-[400px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform hover:scale-[1.005] hover:shadow-xl flex flex-row gap-6">
                        <div className="h-[350px] w-[250px] flex flex-col items-center justify-between">
                            <div className="text-3xl font-bold text-center text-white">
                                {user?.fname} {user?.lname}
                            </div>
                            <div className="h-[200px] w-[200px] bg-gray-700 rounded-full flex items-center justify-center">
                                <User className="w-20 h-20 text-purple-500" />
                            </div>
                            <button className="w-full text-center bg-purple-600 rounded-3xl py-2 hover:bg-purple-700 transition-colors">
                                <span className="text-lg font-bold">Link to Spotify</span>
                            </button>
                        </div>

                        <div className="h-[350px] w-[400px] flex flex-col justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-xl font-bold">Your City:</div>
                                <input className="flex-1 border border-gray-600 bg-gray-700 rounded-lg p-2" />
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-700 p-4 rounded-lg text-center">
                                    <Calendar className="w-6 h-6 text-purple-500 mx-auto" />
                                    <p className="mt-2 text-xl font-bold">{userConcerts.length}</p>
                                    <p className="text-sm text-gray-400">Attended</p>
                                </div>
                                <div className="bg-gray-700 p-4 rounded-lg text-center">
                                    <Star className="w-6 h-6 text-yellow-500 mx-auto" />
                                    <p className="mt-2 text-xl font-bold">
                                        {userConcerts.filter(concert => concert.review).length}
                                    </p>
                                    <p className="text-sm text-gray-400">Reviews</p>
                                </div>
                                <div className="bg-gray-700 p-4 rounded-lg text-center">
                                    <Heart className="w-6 h-6 text-red-500 mx-auto" />
                                    <p className="mt-2 text-xl font-bold">
                                        {userConcerts.filter(concert => concert.favorite).length}
                                    </p>
                                    <p className="text-sm text-gray-400">Favorites</p>
                                </div>
                            </div>

                            {/* Top Artists */}
                            <div>
                                <div className="text-xl font-bold mb-2">Your Top Artists:</div>
                                <div className="grid grid-cols-4 gap-4">
                                    {[1,2,3,4].map((_, i) => (
                                        <div key={i} className="h-[75px] w-[75px] bg-gray-700 rounded-full border-4 border-gray-600 transform hover:scale-[1.2] transition-transform"></div>
                                    ))}
                                </div>
                            </div>
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
                                    
                                    {/* Review Text Area */}
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
                </div>

                <div className="w-[750px] flex flex-col space-y-6">
                    {/* Wish List */}
                    <div className="h-[530px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform hover:scale-[1.005] hover:shadow-xl flex flex-col items-center justify-center"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}>
                        <h2 className="text-2xl font-bold mb-4">Wish List</h2>
                        <div className="w-[650px] h-[450px] relative">
                            {wishList.slice(0, 11).map((concertdata, index) => (
                                <WishListBubble
                                    key={index}
                                    concertdata={concertdata}
                                    clickItemFunc={concertItemClicked}
                                    isSelected={true}
                                    scale={wishListBubbleLayoutKey[index][0]}
                                    left={wishListBubbleLayoutKey[index][1]}
                                    top={wishListBubbleLayoutKey[index][2]}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;