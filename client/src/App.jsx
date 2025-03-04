import React from 'react'
import HomePage from './pages/home.jsx'
import './index.css'
import ArtistPage from './pages/artistPage.jsx'
import UserPage from './pages/UserPage.jsx'
import PostgreSQLTestForm from './pages/TestForm.jsx'

function App() {
  // Simple routing based on current path
  const path = window.location.pathname;
  
  // Render appropriate component based on URL path
  const renderComponent = () => {
    if (path === '/') {
      return <HomePage />;
    } else if (path.startsWith('/artist/')) {
      return <ArtistPage />;
    } else if (path === '/user') {
      return <UserPage />;
    } else if (path === '/test') {
      return <PostgreSQLTestForm />;
    } else {
      // Default to home if no match
      window.location.href = '/';
      return <HomePage />;
    }
  };

  return renderComponent();
}

export default App;