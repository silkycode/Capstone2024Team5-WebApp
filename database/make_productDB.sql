CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_type TEXT NOT NULL,
    model_name TEXT NOT NULL,
    description TEXT NOT NULL,
    image BLOB
);