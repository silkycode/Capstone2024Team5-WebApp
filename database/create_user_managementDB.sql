.open user_management.db

-- 'account' table, relevant for authentication
-- 1, admin, 0 not admin
CREATE TABLE IF NOT EXISTS account (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    last_login_date TEXT DEFAULT NULL,
    failed_logins INTEGER DEFAULT 0,
    date_created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_admin INTEGER DEFAULT 0
);

-- 'user' table for server and client-side dynamic data display
-- one-to-one relationship between user and account, 1 user per account
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    dob TEXT,
    primary_phone TEXT,
    secondary_phone TEXT,
    address TEXT,
    primary_insurance TEXT,
    medical_id TEXT,
    contact_person TEXT,
    FOREIGN KEY (id) REFERENCES account (id) ON DELETE CASCADE
);

-- 'glucose_log' table for each user's log history + measurements
CREATE TABLE IF NOT EXISTS glucose_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    glucose_level INTEGER NOT NULL,
    creation_date TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);

-- 'appointment' table for upcoming appointments to track
CREATE TABLE IF NOT EXISTS appointment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    appointment_date TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    appointment_notes TEXT,
    creation_date TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);

-- 'notification' table for various notifications and frontpage displays
CREATE TABLE IF NOT EXISTS notification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    notification TEXT NOT NULL,
    importance INTEGER NOT NULL,
    creation_date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);


-- Some dummy database info for debugging
INSERT INTO account (username, email, password_hash, is_admin) VALUES 
('user1', 'user1@email.com', sha3('password1', 256), 0),
('user2', 'user2@email.com', sha3('password2', 256), 0),
('user3', 'user3@email.com', sha3('password3', 256), 0),
('admin1', 'admin1@email.com', sha3('adminpassword', 256), 1);

INSERT INTO user (id, first_name, last_name, dob, primary_phone, secondary_phone, address, primary_insurance, medical_id, contact_person) VALUES 
(1, 'John', 'Doe', '12/21/1991', '3062915555', '4253284555', '123 St.', 'Blue Cross', '1213914', 'Jane Doe'),
(2, 'Rob', 'Smith', '06/25/1981', '4259151555', '4253284555', '123 St.', 'Apple Health', '3124312', 'Jane Smith'),
(3, 'Dave', 'Person', '08/25/1491', '4252915555', '4253284555', '123 St.', 'Medina', '132421', 'Jane Person');

INSERT INTO glucose_log (user_id, glucose_level) VALUES 
(1, 120),
(1, 110),
(2, 130),
(2, 140),
(3, 100);

INSERT INTO appointment (user_id, appointment_date, doctor_name, appointment_notes) VALUES
(1, '2024-03-15 10:00:00', 'Dr. Smith', 'Screening checkup'),
(2, '2024-03-16 11:30:00', 'Dr. Johnson', 'Discuss medication dosage, DME'),
(3, '2024-03-20 09:15:00', 'Dr. Brown', 'Blood test and consultation'),
(1, '2024-03-25 14:00:00', 'Dr. Lee', 'Follow-up appointment');

INSERT INTO notification (user_id, notification, importance) VALUES
(1, 'Reminder: Your appointment with Dr. Smith is tomorrow.', 2),
(2, 'You have a scheduled appointment with Dr. Johnson on Thursday.', 1),
(3, 'Your blood test results are ready. Please schedule an appointment for review.', 3),
(1, 'New glucose log entry: 120 mg/dL at 8:00 AM.', 1),
(2, 'New glucose log entry: 140 mg/dL at 10:15 AM.', 1);