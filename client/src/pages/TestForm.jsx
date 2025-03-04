import React, { useState, useEffect } from 'react';

const PostgresTestForm = () => {
  const [formData, setFormData] = useState({
    artistFname: '',
    artistLname: '',
    venueName: '',
    venueCity: '',
    tourName: '',
    concertDate: '',
    concertTime: ''
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [artists, setArtists] = useState([]);
  const [venues, setVenues] = useState([]);
  const [concerts, setConcerts] = useState([]);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);
   
  const fetchData = async () => {
    try {
      // Fetch artists
      const artistsRes = await fetch('http://localhost:3000/api/postgres/artists');
      const artistsData = await artistsRes.json();
      setArtists(artistsData);
      
      // Fetch venues
      const venuesRes = await fetch('http://localhost:3000/api/postgres/venues');
      const venuesData = await venuesRes.json();
      setVenues(venuesData);
      
      // Fetch concerts
      const concertsRes = await fetch('http://localhost:3000/api/postgres/concert-details');
      const concertsData = await concertsRes.json();
      setConcerts(concertsData);
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    }
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/postgres/complete-concert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create concert');
      }
      
      setMessage('Concert created successfully!');
      
      // Reset form
      setFormData({
        artistFname: '',
        artistLname: '',
        venueName: '',
        venueCity: '',
        tourName: '',
        concertDate: '',
        concertTime: ''
      });
      
      // Refresh data
      fetchData();
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">PostgreSQL Test Form</h2>
      
      {message && (
        <div className="bg-green-500 text-white p-3 rounded-lg mb-4">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Artist First Name</label>
            <input
              type="text"
              name="artistFname"
              value={formData.artistFname}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Artist Last Name</label>
            <input
              type="text"
              name="artistLname"
              value={formData.artistLname}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Venue Name</label>
            <input
              type="text"
              name="venueName"
              value={formData.venueName}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Venue City</label>
            <input
              type="text"
              name="venueCity"
              value={formData.venueCity}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-1">Tour Name</label>
          <input
            type="text"
            name="tourName"
            value={formData.tourName}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Concert Date</label>
            <input
              type="date"
              name="concertDate"
              value={formData.concertDate}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Concert Time</label>
            <input
              type="time"
              name="concertTime"
              value={formData.concertTime}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Concert
        </button>
      </form>
      
      <div className="mt-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Artists</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr>
                  <th className="p-2 text-left text-gray-300">ID</th>
                  <th className="p-2 text-left text-gray-300">First Name</th>
                  <th className="p-2 text-left text-gray-300">Last Name</th>
                </tr>
              </thead>
              <tbody>
                {artists.map(artist => (
                  <tr key={artist.aid} className="border-t border-gray-600">
                    <td className="p-2 text-gray-300">{artist.aid}</td>
                    <td className="p-2 text-gray-300">{artist.fname}</td>
                    <td className="p-2 text-gray-300">{artist.lname}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Venues</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr>
                  <th className="p-2 text-left text-gray-300">ID</th>
                  <th className="p-2 text-left text-gray-300">Name</th>
                  <th className="p-2 text-left text-gray-300">City</th>
                </tr>
              </thead>
              <tbody>
                {venues.map(venue => (
                  <tr key={venue.vid} className="border-t border-gray-600">
                    <td className="p-2 text-gray-300">{venue.vid}</td>
                    <td className="p-2 text-gray-300">{venue.name}</td>
                    <td className="p-2 text-gray-300">{venue.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Concerts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr>
                  <th className="p-2 text-left text-gray-300">ID</th>
                  <th className="p-2 text-left text-gray-300">Artist</th>
                  <th className="p-2 text-left text-gray-300">Tour</th>
                  <th className="p-2 text-left text-gray-300">Venue</th>
                  <th className="p-2 text-left text-gray-300">City</th>
                  <th className="p-2 text-left text-gray-300">Date</th>
                  <th className="p-2 text-left text-gray-300">Time</th>
                </tr>
              </thead>
              <tbody>
                {concerts.map(concert => (
                  <tr key={concert.cid} className="border-t border-gray-600">
                    <td className="p-2 text-gray-300">{concert.cid}</td>
                    <td className="p-2 text-gray-300">{concert.artist_name}</td>
                    <td className="p-2 text-gray-300">{concert.tour_name}</td>
                    <td className="p-2 text-gray-300">{concert.venue_name}</td>
                    <td className="p-2 text-gray-300">{concert.city}</td>
                    <td className="p-2 text-gray-300">{new Date(concert.date).toLocaleDateString()}</td>
                    <td className="p-2 text-gray-300">{concert.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostgresTestForm;