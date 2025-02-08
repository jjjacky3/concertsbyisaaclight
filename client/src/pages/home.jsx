import React from 'react';
import { Search, Star, Calendar, Ticket } from 'lucide-react';

const HomePage = () => {
  const headerStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '4rem 2rem',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  };

  const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    marginTop: '2rem',
  };

  const searchInputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
  };

  const featuresContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    padding: '4rem 1rem',
  };

  const featureCardStyle = {
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
  };

  const footerStyle = {
    backgroundColor: '#f3f4f6',
    padding: '2rem',
    textAlign: 'center',
    marginTop: '2rem',
  };

  return (
    <div>
      {/* Hero Section */}
      <header style={headerStyle}>
        <div style={containerStyle}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>OnlyConcerts</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Make informed decisions about your next concert experience
          </p>
          
          {/* Search Bar */}
          <div style={searchContainerStyle}>
            <Search style={{ color: '#9ca3af' }} />
            <input 
              type="text" 
              placeholder="Search for artists, venues, or tours..." 
              style={searchInputStyle}
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <main style={containerStyle}>
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', margin: '2rem 0' }}>
          Why OnlyConcerts?
        </h2>
        
        <div style={featuresContainerStyle}>
          {/* Feature 1 */}
          <div style={featureCardStyle}>
            <Star style={{ width: 48, height: 48, color: '#2563eb', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Detailed Reviews</h3>
            <p>Access comprehensive concert reviews and ratings from real attendees</p>
          </div>

          {/* Feature 2 */}
          <div style={featureCardStyle}>
            <Calendar style={{ width: 48, height: 48, color: '#2563eb', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Tour Information</h3>
            <p>Get complete tour details including setlists, venues, and price ranges</p>
          </div>

          {/* Feature 3 */}
          <div style={featureCardStyle}>
            <Ticket style={{ width: 48, height: 48, color: '#2563eb', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Historical Data</h3>
            <p>Explore past tour performances and rating trends</p>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', margin: '3rem 0' }}>
          <button style={buttonStyle}>
            Sign Up Now
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={containerStyle}>
          <p style={{ color: '#4b5563' }}>© 2025 OnlyConcerts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;