.open user_management.db

-- 'credentials' table, relevant for authentication
CREATE TABLE IF NOT EXISTS credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- 'users' table for server and client-side dynamic data display
-- one-to-one relationship between user and credentials, 1 user per set of credentials
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    dob DATE,
    primary_phone TEXT,
    secondary_phone TEXT,
    address TEXT,
    primary_insurance TEXT,
    id_number TEXT,
    contact_person TEXT,
    last_office_visit DATE,
    doctor_name TEXT,
    doctor_phone TEXT,
    doctor_fax TEXT,
    FOREIGN KEY (id) REFERENCES credentials (id)
);

-- 'glucose_logs' table for each user's log history + measurements
CREATE TABLE IF NOT EXISTS glucose_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    glucose_level INTEGER,
    log_timestamp DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 'appointments' table for upcoming appointments to track
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    appointment_date DATE,
    appointment_time TIME,
    doctor_name TEXT,
    appointment_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 'status' table for various notifications and frontpage displays
CREATE TABLE IF NOT EXISTS status (
    status_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    notification TEXT,
    importance INTEGER,
    status_timestamp DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (id)
);


-- Some dummy users for debugging
INSERT INTO credentials (username, email, password_hash) VALUES ('user1', 'user1@email.com', sha3('password1', 256));
INSERT INTO credentials (username, email, password_hash) VALUES ('user2', 'user2@email.com', sha3('password2', 256));
INSERT INTO credentials (username, email, password_hash) VALUES ('user3', 'user3@email.com', sha3('password3', 256));