import React, { useEffect, useState } from 'react';

function showProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("There was an error!", error));
  }, []);

  return (
    <div className="showProducts">
      <header className="showProducts-header">
        <h1>Products</h1>
        <div className="product-list">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <h2>{product.model_name}</h2>
              <p>{product.description}</p>
              {product.image && (
                <img src={`data:image/png;base64,${product.image}`} alt={product.model_name} style={{ maxWidth: '100%', height: 'auto' }} />
              )}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default showProducts;
