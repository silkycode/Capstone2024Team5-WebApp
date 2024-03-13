.open user_management.db

-- 'credentials' table, relevant for authentication
CREATE TABLE IF NOT EXISTS credentials (
    credentials_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- 'users' table for server and client-side dynamic data display
-- one-to-one relationship between user and credentials, 1 user per set of credentials
CREATE TABLE IF NOT EXISTS users (
    credentials_id INTEGER PRIMARY KEY,
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
    FOREIGN KEY (credentials_id) REFERENCES credentials (id) ON DELETE CASCADE
);

-- 'glucose_logs' table for each user's log history + measurements
CREATE TABLE IF NOT EXISTS glucose_log (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    glucose_level INTEGER,
    log_timestamp DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (credentials_id) ON DELETE CASCADE
);

-- 'appointments' table for upcoming appointments to track
CREATE TABLE IF NOT EXISTS appointment (
    appointment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    appointment_date DATETIME,
    doctor_name TEXT,
    appointment_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users (credentials_id) ON DELETE CASCADE
);

-- 'status' table for various notifications and frontpage displays
CREATE TABLE IF NOT EXISTS notification (
    status_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    notification TEXT,
    importance INTEGER,
    status_timestamp DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (credentials_id) ON DELETE CASCADE
);


-- Some dummy database info for debugging
INSERT INTO credentials (username, email, password_hash) VALUES ('user1', 'user1@email.com', sha3('password1', 256));
INSERT INTO credentials (username, email, password_hash) VALUES ('user2', 'user2@email.com', sha3('password2', 256));
INSERT INTO credentials (username, email, password_hash) VALUES ('user3', 'user3@email.com', sha3('password3', 256));

INSERT INTO glucose_log (user_id, glucose_level, log_timestamp) VALUES 
(1, 120, '2024-03-10 08:00:00'),
(1, 110, '2024-03-11 09:30:00'),
(2, 130, '2024-03-10 07:45:00'),
(2, 140, '2024-03-12 10:15:00'),
(3, 100, '2024-03-09 11:00:00');

-- Inserting dummy appointments
INSERT INTO appointment (user_id, appointment_date, doctor_name, appointment_notes) VALUES
(1, '2024-03-15 10:00:00', 'Dr. Smith', 'Screening checkup'),
(2, '2024-03-16 11:30:00', 'Dr. Johnson', 'Discuss medication dosage, DME'),
(3, '2024-03-20 09:15:00', 'Dr. Brown', 'Blood test and consultation'),
(1, '2024-03-25 14:00:00', 'Dr. Lee', 'Follow-up appointment');

-- Inserting dummy notifications
INSERT INTO notification (user_id, notification, importance, status_timestamp) VALUES
(1, 'Reminder: Your appointment with Dr. Smith is tomorrow.', 2, '2024-03-14 15:00:00'),
(2, 'You have a scheduled appointment with Dr. Johnson on Thursday.', 1, '2024-03-13 10:30:00'),
(3, 'Your blood test results are ready. Please schedule an appointment for review.', 3, '2024-03-12 12:45:00'),
(1, 'New glucose log entry: 120 mg/dL at 8:00 AM.', 1, '2024-03-10 08:15:00'),
(2, 'New glucose log entry: 140 mg/dL at 10:15 AM.', 1, '2024-03-12 10:30:00');