import React from 'react'
import HomePage from './pages/home.jsx'
import './index.css'
import ArtistPage from './pages/artistPage.jsx'
import Artist from '../../server/models/Artist.js'
import Tour from '../../server/models/Tour.js'
import Concert from '../../server/models/DamienConcert.js'


function App() {

  // Create Alec Benjamin artist instance
  const AlecBenjamin = new Artist(
    'Alec Benjamin',
    { 1: 1, 2: 1, 3: 1, 4: 2, 5: 10 },
    `url('../src/components/ArtistBannerImages/AlecBenjaminBannerImage.jpg')`,
    90
  );

  // Create Tours
  const tour1 = new Tour(AlecBenjamin, 'Narrated by Heart Tour');
  const tour2 = new Tour(AlecBenjamin, "The Lyricist's Journey Tour");

  // Create Concerts and Add to Artist
  const concerts = [
    new Concert(
      'Alec Benjamin',
      "The Storyteller's Night",
      'Jan 20',
      'Atlanta',
      4.6,
      'Join Alec Benjamin for an unforgettable evening of storytelling and music on the "Narrated by Heart Tour." Experience his raw, heartfelt lyrics and intimate melodies live as he takes you on a journey through songs like never before. With a setlist featuring fan favorites and exclusive unreleased tracks, this concert promises an emotional and mesmerizing performance that will leave you captivated.',
      90,
      tour1
    ),
    new Concert(
      'Alec Benjamin',
      'Poetry in Motion',
      'March 15',
      'Los Angeles',
      4.8,
      'Step into a world of vivid storytelling and heartfelt melodies with Alec Benjamin’s "The Lyricist’s Journey Tour." This one-night-only experience will immerse fans in his signature acoustic sound, raw emotions, and captivating narratives. From beloved classics to new, soul-stirring tracks, this concert promises to be a night to remember.',
      79,
      tour2
    ),
    new Concert(
      'Alec Benjamin',
      'Verses & Echoes',
      'June 22',
      'Chicago',
      4.3,
      'Lose yourself in the poetic storytelling and hauntingly beautiful melodies of Alec Benjamin’s "Reflections in Sound Tour." This intimate performance will take audiences on an emotional journey through music, blending heartfelt lyrics with captivating instrumentals. Featuring a mix of chart-topping hits and exclusive new material, this concert is a must-see for fans who love music that tells a story.',
      50,
      tour1
    ),
    new Concert(
      'Alec Benjamin',
      'The Heartstrings Tour',
      'Sept 10',
      'Boston',
      4.7,
      'Join Alec Benjamin for an intimate evening on "The Heartstrings Tour," where his deeply personal lyrics and storytelling take center stage. This show will feature stripped-down acoustic performances of fan-favorite songs, as well as brand-new tracks that capture the raw essence of his songwriting. A truly special night for those who connect with music on an emotional level.',
      95,
      tour2
    ),

    new Concert(
      'Alec Benjamin',
      'Melodies & Memories',
      'May 5',
      'San Francisco',
      4.5,
      'Experience an evening of nostalgia and emotion as Alec Benjamin takes you on a journey through his most touching and heartfelt songs. "Melodies & Memories" blends acoustic storytelling with beautifully crafted lyrics, creating an intimate and unforgettable concert experience.',
      85,
      tour2
    ),

    new Concert(
      'Alec Benjamin',
      'Unplugged & Raw',
      'July 12',
      'Seattle',
      4.7,
      'Join Alec Benjamin for a stripped-down, acoustic night where he shares the raw emotions behind his songs. This special performance offers fans a closer, more personal connection to Alec’s music, featuring deep cuts and new material never performed live before.',
      75,
      tour1
    ),

    new Concert(
      'Alec Benjamin',
      'The Echoes Tour',
      'Oct 18',
      'Miami',
      4.8,
      'Feel the echoes of emotion as Alec Benjamin delivers a setlist filled with fan-favorites and new releases. With an immersive atmosphere and deeply personal storytelling, "The Echoes Tour" is a must-attend experience for those who love lyrical depth and captivating melodies.',
      100,
      tour2
    )
  ];

  // Add concerts to artist
  concerts.forEach(concert => AlecBenjamin.addConcert(concert));




  return (
    <>
      <ArtistPage artist={AlecBenjamin} />
    </>
  )
}

export default App