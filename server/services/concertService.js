const axios = require('axios');
const { faker } = require('@faker-js/faker');
const pool = require('../db');
require('dotenv').config();

class ConcertService {
    constructor() {
        this.useRealApi = process.env.USE_REAL_API === 'true';
        this.clientId = process.env.CLIENT_ID;
        
        if (this.useRealApi && !this.clientId) {
            console.error("Missing SEATGEEK_CLIENT_ID in .env");
            process.exit(1);
        }

        // Fallback data in case API fails
        this.popularArtists = [
            { fname: 'Taylor', lname: 'Swift' },
            { fname: 'Ed', lname: 'Sheeran' },
            { fname: 'The', lname: 'Weeknd' },
            { fname: 'Beyoncé', lname: '' },
            { fname: 'Drake', lname: '' },
            { fname: 'Bad', lname: 'Bunny' },
            { fname: 'Harry', lname: 'Styles' },
            { fname: 'Lady', lname: 'Gaga' },
            { fname: 'Bruno', lname: 'Mars' },
            { fname: 'Coldplay', lname: '' }
        ];
        
        this.venues = [
            { name: 'Madison Square Garden', city: 'New York' },
            { name: 'The O2 Arena', city: 'London' },
            { name: 'Staples Center', city: 'Los Angeles' },
            { name: 'Red Rocks Amphitheatre', city: 'Morrison' },
            { name: 'Sydney Opera House', city: 'Sydney' },
            { name: 'Royal Albert Hall', city: 'London' },
            { name: 'Hollywood Bowl', city: 'Los Angeles' },
            { name: 'Radio City Music Hall', city: 'New York' },
            { name: 'Wembley Stadium', city: 'London' },
            { name: 'Carnegie Hall', city: 'New York' }
        ];
        
        this.tourNames = [
            'World Tour 2024',
            'Summer Festival Tour',
            'Acoustic Sessions',
            'Greatest Hits Tour',
            'Album Release Tour',
            'Reunion Tour',
            'Anniversary Tour',
            'Unplugged Tour',
            'Stadium Tour',
            'International Tour'
        ];
    }

    async fetchRealConcerts() {
        try {
            // const cities = ['New York', 'Los Angeles', 'Chicago', 'Atlanta', 'Miami'];
            const cities = ['Atlanta']
            let allEvents = [];

            for (const city of cities) {
                let page = 1;
                let totalPages = 1;
                while (page<=totalPages) {
                    // const url = `https://api.seatgeek.com/2/events?venue.city=${encodeURIComponent(city)}&taxonomies.name=concert&client_id=${this.clientId}`;
                    const url = `https://api.seatgeek.com/2/events?venue.city=${encodeURIComponent(city)}&per_page=20&page=${page}&taxonomies.name=concert&client_id=${this.clientId}`;
                    const response = await axios.get(url);

                    const meta = response.data.meta;
                    totalPages = meta.total > 0 ? Math.ceil(meta.total / 20) : 0;
                    
                    const events = response.data.events.map(event => {
                        const performer = event.performers[0] || {};
                        const [fname, ...lnameParts] = (performer.name || '').split(' ');
                        const lname = lnameParts.join(' ');
                        const currentYear = new Date().getFullYear();

                        // Adjust the time if too great (cutoff is current year)
                        let dateObj = new Date(event.datetime_local);
                        if (dateObj.getFullYear() > currentYear) {
                            dateObj.setFullYear(dateObj.getFullYear() - 10);
                        }
                        const adjustedDate = dateObj.toISOString().split('T')[0];
                        const adjustedTime = dateObj.toISOString().split('T')[1].substring(0, 8);

                        return {
                            artist: {
                                fname: fname || '',
                                lname: lname || ''
                            },
                            venue: {
                                name: event.venue.name,
                                city: event.venue.city
                            },
                            tourName: event.title,
                            date: adjustedDate,
                            time: adjustedTime,
                            price: event.stats.average_price || faker.number.float({ min: 30, max: 300, precision: 2 }),
                            image_url: performer.image || null
                        };
                    });

                    allEvents = allEvents.concat(events);

                    page+=1;
                }
            }

            if (allEvents.length === 0) {
                throw new Error('No events found from SeatGeek API');
            }

            return allEvents;
        } catch (error) {
            console.error('Error fetching real concert data:', error);
            throw error;
        }
    }

    async clearDatabase() {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Delete in reverse order of dependencies
            await client.query('DELETE FROM Concert');
            await client.query('DELETE FROM Tour');
            await client.query('DELETE FROM Artist');
            await client.query('DELETE FROM Venue');
            
            await client.query('COMMIT');
            console.log('Successfully cleared all concert-related data from database');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error clearing database:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async generateMockConcerts(count = 50) {
        const concerts = [];
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6);

        for (let i = 0; i < count; i++) {
            const artist = faker.helpers.arrayElement(this.popularArtists);
            const venue = faker.helpers.arrayElement(this.venues);
            const tourName = faker.helpers.arrayElement(this.tourNames);
            
            const concertDate = faker.date.between({ from: startDate, to: endDate });
            const hours = faker.number.int({ min: 18, max: 22 }); // Concerts between 6 PM and 10 PM
            const minutes = faker.helpers.arrayElement(['00', '30']); // Concerts start on hour or half hour
            
            concerts.push({
                artist,
                venue,
                tourName,
                date: concertDate.toISOString().split('T')[0],
                time: `${hours}:${minutes}:00`,
                price: faker.number.float({ min: 30, max: 300, precision: 2 }),
                image_url: faker.image.url()
            });
        }

        return concerts;
    }

    async syncMockConcertsToDatabase() {
        const client = await pool.connect();
        try {
            // Clear existing data first
            await this.clearDatabase();
            
            let concerts;
            if (this.useRealApi) {
                concerts = await this.fetchRealConcerts();
                console.log("Fetched real concert data")
            } else {
                concerts = await this.generateMockConcerts();
            }

            await client.query('BEGIN');
            
            for (const concert of concerts) {
                // Insert or update artist
                const artistRes = await client.query(
                    'INSERT INTO Artist (fname, lname) VALUES ($1, $2) ON CONFLICT (fname, lname) DO UPDATE SET updated_at = NOW() RETURNING aid',
                    [concert.artist.fname, concert.artist.lname]
                );
                const artistId = artistRes.rows[0].aid;

                // Insert or update venue
                const venueRes = await client.query(
                    'INSERT INTO Venue (name, city) VALUES ($1, $2) ON CONFLICT (name, city) DO UPDATE SET updated_at = NOW() RETURNING vid',
                    [concert.venue.name, concert.venue.city]
                );
                const venueId = venueRes.rows[0].vid;

                // Insert or update tour
                const tourRes = await client.query(
                    'INSERT INTO Tour (aid, name) VALUES ($1, $2) ON CONFLICT (aid, name) DO UPDATE SET updated_at = NOW() RETURNING tid',
                    [artistId, concert.tourName]
                );
                const tourId = tourRes.rows[0].tid;

                // Log the data being inserted
                console.log('Inserting concert:', {
                    date: concert.date,
                    time: concert.time,
                    artistId,
                    venueId,
                    tourId,
                    price: concert.price,
                    image_url: concert.image_url
                });

                // Insert or update concert
                await client.query(
                    `INSERT INTO Concert (date, time, aid, vid, tid, price, image_url) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7)
                     ON CONFLICT (date, time, aid, vid) 
                     DO UPDATE SET 
                        price = EXCLUDED.price,
                        image_url = EXCLUDED.image_url,
                        updated_at = NOW()`,
                    [concert.date, concert.time, artistId, venueId, tourId, concert.price, concert.image_url]
                );
            }

            await client.query('COMMIT');
            return { message: 'Successfully synced concerts', count: concerts.length };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error syncing concerts:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async searchConcerts(params = {}) {
        try {
            const query = `
                SELECT 
                    c.cid as id,
                    c.date,
                    c.time,
                    c.price,
                    c.image_url as "image_url",
                    a.fname || ' ' || a.lname as artist,
                    t.name as "tourName",
                    v.name as venue,
                    v.city
                FROM Concert c
                JOIN Artist a ON c.aid = a.aid
                JOIN Tour t ON c.tid = t.tid
                JOIN Venue v ON c.vid = v.vid
                WHERE ($1::text IS NULL OR LOWER(a.fname || ' ' || a.lname) LIKE LOWER($1))
                AND ($2::text IS NULL OR LOWER(v.city) = LOWER($2))
                AND ($3::date IS NULL OR c.date >= $3)
                AND ($4::date IS NULL OR c.date <= $4)
                ORDER BY c.date ASC, c.time ASC
                LIMIT $5 OFFSET $6
            `;

            // Log the search parameters
            console.log('Searching concerts with params:', params);

            const values = [
                params.keyword ? `%${params.keyword}%` : null,
                params.city || null,
                params.startDate || null,
                params.endDate || null,
                params.limit || 20,
                params.offset || 0
            ];

            const result = await pool.query(query, values);
            
            // Log the search results
            console.log('Search results:', result.rows);
            
            return result.rows;
        } catch (error) {
            console.error('Error searching concerts:', error);
            throw error;
        }
    }
}

module.exports = new ConcertService();