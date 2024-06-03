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
    is_admin INTEGER DEFAULT 0,
    deleted INTEGER DEFAULT 0,
    delete_time TEXT DEFAULT NULL
);

-- refresh token management for logged in users and their JWTs
CREATE TABLE IF NOT EXISTS refresh_token (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    refresh_token TEXT UNIQUE NOT NULL,
    expiration_time TEXT NOT NULL,
    session_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
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
-- 0: generic notification, 1: log reminder notification, 2: appointment reminder notification
CREATE TABLE IF NOT EXISTS notification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    notification TEXT NOT NULL,
    importance INTEGER NOT NULL,
    type INTEGER NOT NULL,
    creation_date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    creation_date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title TEXT NOT NULL,
    task_notes TEXT,
    deadline TEXT NOT NULL,
    created_by TEXT NOT NULL,
    importance INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);