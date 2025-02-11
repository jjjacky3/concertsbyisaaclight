class Concert {
    constructor(artist, name, date, city, rating, desc, price, tour) {
        this.artist = artist;
        this.name = name;
        this.date = date;
        this.city = city;
        this.rating = rating;
        this.desc = desc;
        this.price = price;
        this.reviews = []
        this.tour = tour;

    }
}

export default Concert