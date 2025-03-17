import { Menu, Upload, LogIn, LogOut, Sun, Moon, Database } from "lucide-react";
import { useState } from "react";
import PostgreSQLTestForm from "../pages/TestForm.jsx";
import { X } from "lucide-react";

const NavBar = ({ isDarkMode, setIsDarkMode, user, onLogout, onLogin }) => {
    // State for showing test form modal
    const [showTestForm, setShowTestForm] = useState(false);
    
    // Handle navigation without using React Router
    const navigateToHome = () => {
        window.location.href = '/';
    };

    const navigateToUser = () => {
        window.location.href = '/user';
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
                    {/* Postgres Test Button */}
                    <button 
                        onClick={() => setShowTestForm(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                    >
                        <Database className="w-4 h-4" />
                        <span className="hidden sm:inline">Test DB</span>
                    </button>

                    {/* Upload Button (Only shown if user is logged in) */}
                    {user && (
                        <button 
                            onClick={navigateToUser}
                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                        >
                            <Upload className="w-4 h-4" />
                            <span className="hidden sm:inline">Upload</span>
                        </button>
                    )}

                    {/* Login / Logout Button */}
                    {user ? (
                        <button 
                            onClick={onLogout}
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

            {/* PostgreSQL Test Form Modal */}
            {showTestForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
                        <button 
                            onClick={() => setShowTestForm(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                        <PostgreSQLTestForm />
                    </div>
                </div>
            )}
        </>
    );
};

export default NavBar;