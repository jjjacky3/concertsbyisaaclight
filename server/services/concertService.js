const axios = require('axios');
const { faker } = require('@faker-js/faker');
const pool = require('../db');

class ConcertService {
    constructor() {
        this.useRealApi = process.env.USE_REAL_API === 'true';
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

    generateMockConcerts(count = 50) {
        const concerts = [];
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6); // Generate concerts for next 6 months

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
                price: faker.number.float({ min: 30, max: 300, precision: 2 })
            });
        }

        return concerts;
    }

    async syncMockConcertsToDatabase() {
        const client = await pool.connect();
        try {
            const mockConcerts = this.generateMockConcerts();
            await client.query('BEGIN');
            
            for (const concert of mockConcerts) {
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

                // Insert or update concert
                await client.query(
                    `INSERT INTO Concert (date, time, aid, vid, tid, price) 
                     VALUES ($1, $2, $3, $4, $5, $6)
                     ON CONFLICT (date, time, aid, vid) 
                     DO UPDATE SET 
                        price = $6,
                        updated_at = NOW()`,
                    [concert.date, concert.time, artistId, venueId, tourId, concert.price]
                );
            }

            await client.query('COMMIT');
            return { message: 'Successfully synced mock concerts', count: mockConcerts.length };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error syncing mock concerts:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async searchConcerts(params = {}) {
        try {
            const query = `
                SELECT 
                    c.cid,
                    c.date,
                    c.time,
                    c.price,
                    a.fname || ' ' || a.lname as artist_name,
                    t.name as tour_name,
                    v.name as venue_name,
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

            const values = [
                params.keyword ? `%${params.keyword}%` : null,
                params.city || null,
                params.startDate || null,
                params.endDate || null,
                params.limit || 20,
                params.offset || 0
            ];

            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Error searching concerts:', error);
            throw error;
        }
    }
}

module.exports = new ConcertService(); 