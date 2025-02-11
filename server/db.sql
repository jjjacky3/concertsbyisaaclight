-- Create the Artist table
CREATE TABLE Artist (
    aID SERIAL PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL
);

-- Create the User table
CREATE TABLE "User" (  -- "User" is quoted because it's a reserved keyword in SQL
    uID SERIAL PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL
);

-- Create the Venue table
CREATE TABLE Venue (
    vID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL
);

-- Create the Tour table
CREATE TABLE Tour (
    tID SERIAL PRIMARY KEY,
    aID INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (aID) REFERENCES Artist(aID) ON DELETE CASCADE
);

-- Create the Concert table
CREATE TABLE Concert (
    cID SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    aID INT NOT NULL,
    vID INT NOT NULL,
    tID INT NOT NULL,
    FOREIGN KEY (aID) REFERENCES Artist(aID) ON DELETE CASCADE,
    FOREIGN KEY (vID) REFERENCES Venue(vID) ON DELETE CASCADE,
    FOREIGN KEY (tID) REFERENCES Tour(tID) ON DELETE CASCADE
);

-- Create the Review table
CREATE TABLE Review (
    rID SERIAL PRIMARY KEY,
    uID INT NOT NULL,
    cID INT NOT NULL,
    reviewDate DATE NOT NULL,
    reviewText TEXT,
    FOREIGN KEY (uID) REFERENCES "User"(uID) ON DELETE CASCADE,
    FOREIGN KEY (cID) REFERENCES Concert(cID) ON DELETE CASCADE,
    CONSTRAINT review_attended_constraint 
        CHECK ((uID, cID) IN (SELECT uID, cID FROM Attended))  -- Ensures only attendees can review
);

-- Create the Attended table
CREATE TABLE Attended (
    uID INT NOT NULL,
    cID INT NOT NULL,
    PRIMARY KEY (uID, cID),
    FOREIGN KEY (uID) REFERENCES "User"(uID) ON DELETE CASCADE,
    FOREIGN KEY (cID) REFERENCES Concert(cID) ON DELETE CASCADE
);

