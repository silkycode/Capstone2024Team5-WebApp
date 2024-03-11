.open user_management.db

CREATE TABLE IF NOT EXISTS glucose_logs (
    id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    glucose_level INTEGER NOT NULL,
    PRIMARY KEY (id, date, time),
    FOREIGN KEY (id) REFERENCES users(id)
);
