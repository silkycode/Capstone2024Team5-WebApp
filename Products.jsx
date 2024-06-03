import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/dashboard/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("There was an error!", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupProductsIntoPairs = (products) => {
    return products.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 2);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);
  };

  return (
    <div className="showProducts">
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2, width: '150px', height: '40px' }}
      >
        Go Back
      </Button>
      <header className="showProducts-header">
        <h1>Products</h1>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {groupProductsIntoPairs(products).map((productPair, index) => (
              <Grid key={index} item xs={12} md={6}>
                {productPair.map(product => (
                  <div key={product.id} className="product-card">
                    <h2>{product.model_name}</h2>
                    <p>{product.description}</p>
                    {product.image && (
                      <img src={`data:image/png;base64,${product.image}`} alt={product.model_name} style={{ maxWidth: '100%', height: 'auto' }} />
                    )}
                  </div>
                ))}
              </Grid>
            ))}
          </Grid>
        )}
      </header>
    </div>
  );
}