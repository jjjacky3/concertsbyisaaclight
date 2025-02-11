class Tour {
    constructor(artist, name) {
        this.artist = artist;
        this.name = name;
        this.rating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        this.concerts = []

    }

    addConcert(concert) {
        this.concerts.push(concert)
        this.rating[concert.rating] += 1
    }
}

export default Tour