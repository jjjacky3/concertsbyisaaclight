/**
 * 
 * This component renders a responsive navigation header with authentication controls and theme
 * toggling functionality.
 * 
 * It also includes:
 * - A clickable application title that navigates users to the home page
 * - Conditional rendering of account access button for authenticated users
 * - Dynamic login/logout button that changes based on authentication state
 * - A theme toggle button for switching between light and dark modes
 * - Mobile-responsive design with collapsible menu for smaller screens
 * 
 * The component handles authentication state changes by communicating with the parent component,
 * manages navigation to different application routes, and implements proper logout functionality
 * through the API service. Button visibility adapts based on user authentication status, and
 * mobile responsiveness is maintained through selective text display at different breakpoints.
 */


import { Menu, Upload, LogIn, LogOut, Sun, Moon, Database, User } from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from '../services/apiService'; 

const NavBar = ({ isDarkMode, setIsDarkMode, user, onLogout, onLogin }) => {
    const [showTestForm, setShowTestForm] = useState(false);
    
    const navigateToHome = () => {
        window.location.href = '/';
    };

    const navigateToUser = () => {
        window.location.href = '/user';
    };

    const handleLogout = () => {
        logout();
        
        if (onLogout) {
            onLogout();
        } else {
            window.location.reload();
        }
    };

    return (
        <>
            <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900 shadow-md">
                {/* Left Section - Title & Menu Button */}
                <div className="flex items-center space-x-4">
                    {/* Menu Button for Mobile */}
                    <button className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                    {/* Logo/Title */}
                    <h1 
                        className="text-2xl font-bold text-white cursor-pointer"
                        onClick={navigateToHome}
                    >
                        OnlyConcerts
                    </h1>
                </div>

                {/* Right Section - Buttons */}
                <div className="flex items-center space-x-4">
                    {/* Account Button (Only shown if user is logged in) */}
                    {user && (
                        <button 
                            onClick={navigateToUser}
                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                        >
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Account</span>
                        </button>
                    )}

                    {/* Login / Logout Button */}
                    {user ? (
                        <button 
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    ) : (
                        <button 
                            onClick={onLogin}
                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                        >
                            <LogIn className="w-4 h-4" />
                            <span className="hidden sm:inline">Login</span>
                        </button>
                    )}

                    {/* Dark Mode Toggle */}
                    <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
                    </button>
                </div>
            </header>
            
        </>
    );
};

export default NavBar;