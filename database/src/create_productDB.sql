-- 'product' table to store information about a single product
CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_type TEXT NOT NULL,
    model_name TEXT NOT NULL,
    description TEXT NOT NULL,
    image BLOB
);