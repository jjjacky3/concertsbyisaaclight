import React, { useState, useEffect } from "react";
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Star, Heart, Settings, LogOut, Loader2 } from 'lucide-react';
import ConcertItem from "../components/ConcertItem";
import ConcertCard from "../components/ConcertCard";
import ConcertExpandedView from "../components/ConcertExpandView";
import WishListBubble from "../components/WishListBubble";
import { parse } from 'flatted';

const UserPage = () => {
    const [user, setUser] = useState(null);
    const [userConcerts, setUserConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [selectedConcert, setSelectedConcert] = useState(null)
    const [wishList, setWishList] = useState([]);
    const navigate = useNavigate();
    const recomendedList = userConcerts
    const pastList = userConcerts

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
            console.log("Toggle favorite for concert ID:", concertId);
            const token = localStorage.getItem('token');
            console.log("Token:", token ? "Token exists" : "No token found");
            
            // Ensure concertId is a number
            const id = typeof concertId === 'string' ? parseInt(concertId, 10) : concertId;
            console.log("Normalized concert ID:", id);
            
            const concert = userConcerts.find(c => c.cid === id);
            
            if (!concert) {
                console.error("Concert not found with ID:", id);
                return;
            }
            
            console.log("Current favorite status:", concert.favorite);
            const newFavoriteStatus = !concert.favorite;
            console.log("New favorite status will be:", newFavoriteStatus);

            const requestBody = { favorite: newFavoriteStatus };
            console.log("Request body:", JSON.stringify(requestBody));
            
            const url = `http://localhost:3000/api/postgres/concerts/${id}/favorite`;
            console.log("Request URL:", url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log("API response status:", response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error response:", errorText);
                throw new Error('Failed to update favorite status');
            }

            const responseData = await response.json();
            console.log("API response data:", responseData);

            // Update local state
            setUserConcerts(prevConcerts => {
                const updatedConcerts = prevConcerts.map(c =>
                    c.cid === id
                        ? { ...c, favorite: newFavoriteStatus }
                        : c
                );
                console.log("Updated concert in state:", updatedConcerts.find(c => c.cid === id));
                return updatedConcerts;
            });
            
            // Force a re-render by updating a state variable
            setSelectedConcert(prev => prev ? {...prev} : null);
            
            // If the selected concert is the one being favorited, update it too
            if (selectedConcert && selectedConcert.cid === id) {
                setSelectedConcert(prev => ({
                    ...prev,
                    favorite: newFavoriteStatus
                }));
            }
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

    const handleDragOver = (e) => {
        e.preventDefault(); // Required to allow dropping
    };

    const editWishList = (command, concertData) => {
        if (command === "isIn") {
            return wishList.some(item => item.cid === concertData.cid);
        }

        if (command === "add") {
            setWishList(prevList => {
                const alreadyIn = prevList.some(item => item.cid === concertData.cid);
                if (alreadyIn) return prevList;
                const updatedList = [...prevList, concertData].sort((a, b) => new Date(a.date) - new Date(b.date));
                return updatedList;
            });
            return true;
        }

        if (command === "remove") {
            setWishList(prevList => prevList.filter(item => item.cid !== concertData.cid));
            return true;
        }

        return false;
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
        setSelectedConcert(concert)
    };

    const closeOverlay = () => {
        setSelectedConcert(null)
    }

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

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Navbar */}
            <NavBar
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                user={user}
                onLogout={handleLogout}
            />

            {/* Overlay Panel */}
            {selectedConcert && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[600px] h-[400px] flex flex-col items-center justify-center">
                        <ConcertExpandedView concert={selectedConcert}
                            closeOverlay={closeOverlay}
                            editWishList={editWishList}
                            wishList={wishList}
                            favoriteClicked={handleToggleFavorite}
                            handleRating={handleRating}
                            handleReviewText={handleReviewText} />
                    </div>
                </div>
            )}

            <div className="flex justify-center space-x-6 p-6 relative">
                <div className="w-[750px] flex flex-col space-y-6">
                    {/* User Profile */}
                    <div className="h-[400px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl flex flex-row gap-6">
                        <div className="h-[350px] w-[250px] flex flex-col items-center justify-between">
                            <div className="text-3xl font-bold text-center text-white">{user?.fname} {user?.lname}</div>
                            <div className="w-[200px] h-[200px] bg-gray-700 rounded-full flex items-center justify-center">
                                <User className="w-[180px] h-[180px] text-purple-500" />
                            </div>
                            <div className="w-full text-center rounded-3xl py-2 bg-gray-700">
                                <span className="text-lg font-bold text-white ">{user?.email}</span>
                            </div>
                        </div>

                        <div className="h-[350px] w-[450px] flex flex-col justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-1xl font-bold">Your City:</div>
                                <input className="flex-1 border border-gray-400 rounded-lg p-2" />
                            </div>
                            <div className="text-1xl font-bold">Your Top Artists:</div>
                            <div className="grid grid-cols-4 gap-4">
                                {pastList.length > 0 && pastList.slice(0, 4).map((concert, index) => (
                                    <div key={index} className="h-[75px] w-[75px] bg-white rounded-full border-4 border-gray-800 transform hover:scale-[1.2] hover:shadow-xl"
                                        style={{
                                            backgroundImage: `url(${concert.image_url})`,
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center'
                                        }}></div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-0">
                                {/* Card */}
                                <div className="bg-gray-700 rounded-lg shadow-lg p-4 transform hover:scale-105 transition-transform min-h-40 flex flex-col items-center justify-center">
                                    <h2 className="text-2xl font-semibold mb-2 text-center">Concerts Attended</h2>
                                    <div className="flex items-center space-y-1">
                                        <Calendar className="w-7 h-7 text-purple-500" />
                                        <p className="text-5xl font-bold p-2">{userConcerts.length}</p>
                                    </div>
                                </div>

                                {/* Reviews */}
                                <div className="bg-gray-700 rounded-lg shadow-lg p-4 transform hover:scale-105 transition-transform min-h-40 flex flex-col items-center justify-center">
                                    <h2 className="text-2xl font-semibold mb-2 text-center">Reviews</h2>
                                    <div className="flex items-center space-y-1">
                                        <Star className="w-7 h-7 text-yellow-500" />
                                        <p className="text-5xl font-bold p-2">
                                            {userConcerts.filter(concert => concert.review).length}
                                        </p>
                                    </div>
                                </div>

                                {/* Favorites */}
                                <div className="bg-gray-700 rounded-lg shadow-lg p-4 transform hover:scale-105 transition-transform min-h-40 flex flex-col items-center justify-center">
                                    <h2 className="text-2xl font-semibold mb-2 text-center">Favorites</h2>
                                    <div className="flex items-center space-y-1">
                                        <Heart className="w-7 h-7 text-red-500" />
                                        <p className="text-5xl font-bold p-2">
                                            {userConcerts.filter(concert => concert.favorite).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Concerts */}
                    <div className="h-[380px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl flex flex-col justify-center">
                        <div className="text-2xl font-bold text-white text-center mb-4">Recommended Concerts</div>

                        <div className="flex-1 overflow-x-auto">
                            <div className="grid grid-rows-1 grid-flow-col gap-x-4 gap-y-4 w-max">
                                {recomendedList.map((concert, index) => (
                                    <ConcertCard
                                        key={index}
                                        concert={concert}
                                        onClick={setSelectedConcert}
                                        onFavoriteClick={handleToggleFavorite}
                                        onRatingClick={handleRating}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[750px] flex flex-col space-y-6">
                    {/* Past Concerts */}
                    <div className="h-[250px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl flex flex-col justify-center">
                        <div className="text-2xl font-bold text-white text-center mb-4">Past Concerts</div>

                        <div className="flex-1 overflow-x-auto overflow-y-hidden">
                            <div className="scale-75 origin-top-left grid grid-flow-col auto-cols-min gap-x-6 items-center w-max">
                                {pastList.map((concert, index) => (
                                    <ConcertItem
                                        key={index}
                                        concert={concert}
                                        onClick={setSelectedConcert}
                                        onFavoriteClick={handleToggleFavorite}
                                        onRatingClick={handleRating}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Wish List */}
                    <div className="h-[530px] bg-gray-800 rounded-3xl shadow-lg p-6 transition-transform transform hover:scale-[1.005] hover:shadow-xl flex flex-col items-center justify-center"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e)}>
                        <div className="text-2xl font-bold">Wish List</div>
                        <div className=" w-[650px] h-[450px] relative">
                            {wishList.slice(0, 11).map((concertdata, index) => (
                                <WishListBubble
                                    key={index}
                                    concertdata={concertdata}
                                    clickItemFunc={concertItemClicked}
                                    isSelected={true}
                                    scale={wishListBubbleLayoutKey[index][0]}
                                    left={`${wishListBubbleLayoutKey[index][1]}`}
                                    top={`${wishListBubbleLayoutKey[index][2]}`}
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