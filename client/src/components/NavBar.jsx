import { Menu, Filter, Upload, LogIn, LogOut, Sun, Moon } from "lucide-react";

const NavBar = ({ isDarkMode, user }) => {
    return (
        <header className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md">
            {/* Left Section - Title & Menu Button */}
            <div className="flex items-center space-x-4">
                {/* Menu Button for Mobile */}
                <button className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
                </button>
                {/* Logo/Title */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">OnlyConcerts</h1>
            </div>

            {/* Center Section - Search Bar */}
            <div className="flex-grow max-w-md">
                <input
                    type="text"
                    placeholder="Search concerts..."
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
            </div>

            {/* Right Section - Buttons */}
            <div className="flex items-center space-x-4">
                {/* Filter Button */}
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-700">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                </button>

                {/* Upload Button (Only shown if user is logged in) */}
                {user && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700">
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">Upload</span>
                    </button>
                )}

                {/* Login / Logout Button */}
                {user ? (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-700">
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                ) : (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700">
                        <LogIn className="w-4 h-4" />
                        <span className="hidden sm:inline">Login</span>
                    </button>
                )}

                {/* Dark Mode Toggle */}
                <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {isDarkMode ? <Sun className="w-5 h-5 text-gray-900 dark:text-white" /> : <Moon className="w-5 h-5 text-gray-900 dark:text-white" />}
                </button>
            </div>
        </header>
    );
};

export default NavBar;
