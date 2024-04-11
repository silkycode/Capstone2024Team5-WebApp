import React, { useEffect, useState } from 'react'; // Importing necessary modules from React
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook from react-router-dom
import { Button, CircularProgress, Grid } from '@mui/material'; // Importing necessary components from Material-UI
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importing ArrowBackIcon from Material-UI

// Functional component ShowProducts
function ShowProducts() {
  const [products, setProducts] = useState([]); // State to store products fetched from the backend
  const [loading, setLoading] = useState(true); // State to manage loading state
  const navigate = useNavigate(); // Getting navigation function using useNavigate hook from react-router-dom

  // useEffect hook to fetch products when the component mounts
  useEffect(() => {
    // Fetching products from the backend
    fetch('http://localhost:5000/products')
      .then(response => response.json()) // Parsing response data as JSON
      .then(data => {
        setProducts(data); // Updating products state with fetched data
        setLoading(false); // Setting loading state to false after data is fetched
      })
      .catch(error => {
        console.error("There was an error!", error); // Logging error to the console
        setLoading(false); // Setting loading state to false in case of error
      });
  }, []);

  // Function to group products into pairs for grid layout
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
      {/* Button to navigate back */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />} // Icon for back arrow
        onClick={() => navigate('/')} // Click event to navigate back to home
        sx={{ mb: 2, width: '150px', height: '40px' }} // Custom styles for button
      >
        Go Back
      </Button>
      {/* Header section */}
      <header className="showProducts-header">
        <h1>Products</h1>
        {/* Displaying loading spinner if data is being fetched */}
        {loading ? (
          <CircularProgress />
        ) : (
          // Grid layout to display products
          <Grid container spacing={2}>
            {/* Mapping through grouped product pairs and rendering them */}
            {groupProductsIntoPairs(products).map((productPair, index) => (
              <Grid key={index} item xs={12} md={6}>
                {/* Mapping through product pair and rendering individual product cards */}
                {productPair.map(product => (
                  <div key={product.id} className="product-card">
                    <h2>{product.model_name}</h2>
                    <p>{product.description}</p>
                    {/* Rendering product image if available */}
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

export default ShowProducts; // Exporting ShowProducts component
