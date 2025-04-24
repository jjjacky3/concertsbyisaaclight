// Theme utility functions

// Get the current dark mode state from localStorage or default to true
export const getDarkMode = () => {
  const savedMode = localStorage.getItem('darkMode');
  return savedMode !== null ? JSON.parse(savedMode) : true;
};

// Set the dark mode state in localStorage and update the DOM
export const setDarkMode = (isDarkMode) => {
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Initialize dark mode based on localStorage
export const initDarkMode = () => {
  const isDarkMode = getDarkMode();
  setDarkMode(isDarkMode);
  return isDarkMode;
}; 