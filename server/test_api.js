
require('dotenv').config();
// const fetch = require('node-fetch');

const clientId = process.env.CLIENT_ID;

if (!clientId) {
  console.error("Missing SEATGEEK_CLIENT_ID in .env");
  process.exit(1);
}

const url = `https://api.seatgeek.com/2/events?venue.city=Atlanta&taxonomies.name=concert&client_id=${clientId}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    data.events.forEach(event => {
    const performers = event.performers || [];
      const artistNames = performers.map(p => p.name).join(', ');
      const image_url = performers[0]?.image || 'No image available';
      console.log(`Event: ${event.title}`);
      console.log(`Venue: ${event.venue.name}`);
      console.log(`Date: ${event.datetime_local}`);
      console.log(`Image: ${image_url}`);
      console.log(`Artist(s): ${event.performers.map(p => p.name).join(', ')}`);
      console.log('----------------------------');
    });
  })
  .catch(err => console.error('API call failed:', err));
