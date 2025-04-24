import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDarkMode, setDarkMode } from '../utils/themeUtils';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(getDarkMode());

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        setDarkMode(newMode);
    };

    useEffect(() => {
        // Initialize dark mode on mount
        setDarkMode(isDarkMode);
    }, []);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 