-- Create the Artist table
CREATE TABLE Artist (
    aID SERIAL PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(fname, lname)
);

-- Create the User table
CREATE TABLE "User" (
    uid SERIAL PRIMARY KEY,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the Venue table
CREATE TABLE Venue (
    vID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, city)
);

-- Create the Tour table
CREATE TABLE Tour (
    tID SERIAL PRIMARY KEY,
    aID INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aID) REFERENCES Artist(aID) ON DELETE CASCADE,
    UNIQUE(aID, name)
);

-- Create the Concert table
CREATE TABLE Concert (
    cID SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    aID INT NOT NULL,
    vID INT NOT NULL,
    tID INT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aID) REFERENCES Artist(aID) ON DELETE CASCADE,
    FOREIGN KEY (vID) REFERENCES Venue(vID) ON DELETE CASCADE,
    FOREIGN KEY (tID) REFERENCES Tour(tID) ON DELETE CASCADE,
    UNIQUE(date, time, aID, vID)
);

-- Create the Review table
CREATE TABLE Review (
    rID SERIAL PRIMARY KEY,
    uID INT NOT NULL,
    cID INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uID) REFERENCES "User"(uID) ON DELETE CASCADE,
    FOREIGN KEY (cID) REFERENCES Concert(cID) ON DELETE CASCADE,
    UNIQUE(uID, cID)
);

-- Create the Favorite table
CREATE TABLE Favorite (
    fID SERIAL PRIMARY KEY,
    uID INT NOT NULL,
    cID INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uID) REFERENCES "User"(uID) ON DELETE CASCADE,
    FOREIGN KEY (cID) REFERENCES Concert(cID) ON DELETE CASCADE,
    UNIQUE(uID, cID)
);

-- Create indexes for frequently queried columns
CREATE INDEX idx_artist_name ON Artist(fname, lname);
CREATE INDEX idx_venue_city ON Venue(city);
CREATE INDEX idx_concert_date ON Concert(date);
CREATE INDEX idx_review_rating ON Review(rating);
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_review_user ON Review(uID);
CREATE INDEX idx_review_concert ON Review(cID);
CREATE INDEX idx_favorite_user ON Favorite(uID);
CREATE INDEX idx_favorite_concert ON Favorite(cID);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_artist_updated_at
    BEFORE UPDATE ON Artist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venue_updated_at
    BEFORE UPDATE ON Venue
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tour_updated_at
    BEFORE UPDATE ON Tour
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_concert_updated_at
    BEFORE UPDATE ON Concert
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_updated_at
    BEFORE UPDATE ON Review
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

