import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/home.jsx";
import ArtistPage from "./pages/artistPage.jsx";
import UserPage from "./pages/UserPage.jsx";
import "./index.css";

// Define routes with a nested structure that preserves your existing App component
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

// Wrapper to handle post-login initialization
const AppWithLoginCheck = () => {
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
    <RouterProvider router={router} />
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWithLoginCheck />
  </StrictMode>
);