import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home.jsx";
import ArtistPage from "./pages/artistPage.jsx";
import UserPage from "./pages/UserPage.jsx";
import "./index.css";
import { ThemeProvider } from './context/ThemeContext';

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/artist/:artistId",
    element: <ArtistPage />,
  },
  {
    path: "/user",
    element: <UserPage />,
  }
]);

// Wrapper to handle post-login initialization and theme
const AppWithProviders = () => {
  useEffect(() => {
    // Check if user just logged in
    const justLoggedIn = localStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      // Clear the flag
      localStorage.removeItem('justLoggedIn');
      console.log('User logged in successfully - router initialized');
    }
  }, []);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>
);