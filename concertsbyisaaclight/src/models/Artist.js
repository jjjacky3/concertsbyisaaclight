class Artist {
    /**
     * @param name: String
     * @param rating: float
     * @param image: String
     * @param goAgain: int
     */
    constructor(name, ratings, image, goAgain) {
        this.name = name;
        this.ratings = ratings;
        this.image = image;
        this.goAgain = goAgain;
        this.concerts = [];
        this.tours = ['All Tours'];
    }

    /**
     * Adds New Concert to Artist Concert List
     * @param {concert} concert 
     */
    addConcert(concert) {
        this.concerts.push(concert)
        if (!this.tours.includes(concert.tour)) {
            this.tours.push(concert.tour)
        }
    }

    avgRating() {
        const weightedSum = Object.entries(this.ratings).reduce((sum, [key, value]) => sum + key * value, 0);
        const totalWeight = Object.values(this.ratings).reduce((sum, value) => sum + value, 0);

        return totalWeight !== 0 ? weightedSum / totalWeight : 0;
    }

    noralisedRatings() {
        const totalWeight = Object.values(this.rating).reduce((sum, value) => sum + value, 0);

    }
}

export default Artist   