class Artist {
    /**
     * @param name: String
     * @param rating: float
     * @param image: String
     * @param goAgain: int
     */
    constructor(name, rating, image, goAgain) {
        this.name = name;
        this.rating = rating;
        this.image = image;
        this.goAgain = goAgain;
        this.concerts = [];
    }

    /**
     * Adds New Concert to Artist Concert Lists
     * @param {concert} concert 
     */
    addConcert(concert) {
        this.concerts.push(concert)
    }
}

export default Artist   