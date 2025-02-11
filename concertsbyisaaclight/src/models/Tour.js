class Tour {
    constructor(artist, name, rating) {
        this.artist = artist;
        this.name = name;
        this.rating = rating;
        this.concerts = []

    }

    addConcert(concert) {
        this.concerts.push(concert)
    }
}

export default Tour