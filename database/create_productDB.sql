.open products.db

-- 'categories' table to group similar product types
CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT
);

-- 'product' table to store information about a single product
CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_type TEXT NOT NULL,
    model_name TEXT NOT NULL,
    description TEXT NOT NULL,
    image BLOB
    FOREIGN KEY (product_type) REFERENCES categories (category_id)
);