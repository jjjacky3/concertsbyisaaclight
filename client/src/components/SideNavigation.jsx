/**
 * 
 * This component renders a responsive sidebar navigation menu with two main sections:
 * Discover and Genres.
 * 
 * It includes:
 * - A "Discover" section with navigation options like All, New Tours, Recommended, etc.
 * - A "Genres" section displaying music genres with accompanying icon visuals
 * - Visual highlighting of the currently active selection
 * - Interactive elements that trigger parent component state changes
 * 
 * The component applies conditional styling to highlight the active selection,
 * provides hover effects for better user experience, and implements dark mode support
 * with appropriate color transitions. Each menu item triggers the parent component's
 * state update function to change the active genre/section.
 */

import React from 'react';
import { Music } from 'lucide-react';

const SideNavigation = ({ activeGenre, setActiveGenre }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Discover</h3>
        <ul className="space-y-2">
          {['All', 'New Tours', 'Recommended', 'Nearby', 'Following'].map(item => (
            <li
              key={item}
              onClick={() => setActiveGenre(item)}
              className={`cursor-pointer flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 ${
                activeGenre === item ? 'bg-gray-200 dark:bg-gray-700 font-medium' : ''
              } text-gray-900 dark:text-gray-300`}
            >
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Genres</h3>
        <ul className="space-y-2">
          {['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Latin', 'R&B', 'Country', 'Jazz'].map(genre => (
            <li
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`cursor-pointer flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 ${
                activeGenre === genre ? 'bg-gray-200 dark:bg-gray-700 font-medium' : ''
              } text-gray-900 dark:text-gray-300`}
            >
              <Music className="w-4 h-4" />
              <span>{genre}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideNavigation;
