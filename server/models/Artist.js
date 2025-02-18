import Tour from "./Tour";

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
        this.tours = [];
    }

    /**
     * Adds New Concert to Artist Concert List
     * @param {concert} concert 
     */
    addConcert(concert) {
        this.concerts.push(concert)
        if (!this.tours.includes(concert.tour)) {
            console.log("Adding")
            this.tours.push(concert.tour)
            console.log("Tour Added To Tour List")
        }
    }

    avgRating() {
        const weightedSum = Object.entries(this.ratings).reduce((sum, [key, value]) => sum + key * value, 0);
        const totalWeight = Object.values(this.ratings).reduce((sum, value) => sum + value, 0);

        return Math.round(totalWeight !== 0 ? weightedSum / totalWeight * 10 : 0) / 10;
    }

    noralisedRatings() {
        const totalWeight = Object.values(this.rating).reduce((sum, value) => sum + value, 0);

    }

    findTour(name) {
        for (let tour of this.tours) {
            if (tour.name == name) {
                console.log("Tour Found!")
                return tour.ratings
            }
        }
        console.log("TOUR NOT FOUND, tired finding")
        console.log(name)
        console.log("From")
        console.log(this.tours)
    }
}

export default Artist   