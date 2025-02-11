class Tour {
    constructor(artist, name) {
        this.artist = artist;
        this.name = name;
        this.ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        this.concerts = []

    }

    addConcert(concert) {
        console.log("Concert rating is: " + concert.rating)
        this.concerts.push(concert)
        this.ratings[Math.round(concert.rating)] += 1
    }

    getRatings() {
        return this.ratings
    }
}

export default Tour