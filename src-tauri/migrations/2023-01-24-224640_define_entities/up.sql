CREATE TABLE DifficultyEnum (
    enum_val INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE TagTypeEnum (
    enum_val INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE ThemeEnum (
    enum_val INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE
);

INSERT INTO DifficultyEnum (name) 
VALUES ("Easy"), ("Medium"), ("Hard");

INSERT INTO TagTypeEnum (name)
VALUES ("Paradigm"), ("Concept"), ("Trick");

INSERT INTO ThemeEnum (name)
VALUES ("Normal"), ("Dark");

CREATE TABLE Image (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    path TEXT NOT NULL
);

INSERT INTO Image (name, path)
VALUES ("default", "images/default-avatar.png");

CREATE TABLE User (
    id INTEGER PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    avatar INTEGER DEFAULT 1,
    theme INTEGER DEFAULT 1 NOT NULL,
    tagmask INTEGER DEFAULT 0 NOT NULL,
    hidediffs BOOLEAN DEFAULT false NOT NULL,
    FOREIGN KEY(avatar) REFERENCES Image(id),
    FOREIGN KEY(theme) REFERENCES ThemeEnum(enum_val)
);

CREATE TABLE Deck (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    user INTEGER NOT NULL,
    size INTEGER DEFAULT 0 NOT NULL,
    mastered INTEGER DEFAULT 0 NOT NULL,
    FOREIGN KEY(user) REFERENCES User(id) ON DELETE CASCADE,
    UNIQUE (name, user)
);

CREATE TABLE Source (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE Card (
    id INTEGER PRIMARY KEY NOT NULL,
    front INTEGER NOT NULL UNIQUE,
    back INTEGER NOT NULL UNIQUE,
    mastered BOOLEAN DEFAULT false NOT NULL,
    source INTEGER,
    shipped BOOLEAN DEFAULT false NOT NULL,
    difficulty INTEGER NOT NULL,
    FOREIGN KEY(front) REFERENCES CardFront(id),
    FOREIGN KEY(back) REFERENCES CardBack(id),
    FOREIGN KEY(difficulty) REFERENCES Difficulty(enum_val)
);

CREATE TABLE Card_Deck (
    rel_id INTEGER PRIMARY KEY NOT NULL,
    card INTEGER NOT NULL,
    deck INTEGER NOT NULL,
    FOREIGN KEY(card) REFERENCES Card(id) ON DELETE CASCADE,
    FOREIGN KEY(deck) REFERENCES Deck(id) ON DELETE CASCADE
);

CREATE TABLE CardFront (
    id INTEGER PRIMARY KEY NOT NULL,
    card INTEGER NOT NULL,
    prompt TEXT NOT NULL,
    title TEXT NOT NULL,
    FOREIGN KEY(card) REFERENCES Card(id) ON DELETE CASCADE
);

CREATE TABLE CardBack (
    id INTEGER PRIMARY KEY NOT NULL,
    card INTEGER NOT NULL,
    notes TEXT NOT NULL,
    FOREIGN KEY(card) REFERENCES Card(id) ON DELETE CASCADE
);

CREATE TABLE Solution (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    cardback INTEGER NOT NULL,
    FOREIGN KEY(cardback) REFERENCES CardBack(id) ON DELETE CASCADE
);

CREATE TABLE Tag (
    id INTEGER PRIMARY KEY NOT NULL,
    type INTEGER NOT NULL,
    name TEXT,
    content TEXT,
    FOREIGN KEY(type) REFERENCES TagTypeEnum(enum_val)
);

CREATE TABLE Card_Tag (
    rel_id INTEGER PRIMARY KEY NOT NULL,
    card INTEGER NOT NULL,
    tag INTEGER NOT NULL,
    FOREIGN KEY(card) REFERENCES Card(id) ON DELETE CASCADE,
    FOREIGN KEY(tag) REFERENCES Tag(id) ON DELETE CASCADE
);