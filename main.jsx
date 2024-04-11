import React from 'react'; // Importing React library
import ReactDOM from 'react-dom/client'; // Importing ReactDOM for rendering
import App from './App.jsx'; // Importing the main App component
import '@fontsource/roboto/300.css'; // Importing Roboto font styles
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider, createTheme} from '@mui/material/styles'; // Importing ThemeProvider and createTheme from Material-UI

// Creating a custom theme for the application
const theme = createTheme({
  components: {
    MuiButton: { // Customizing the style of MuiButton component
      styleOverrides: {
        root: {
          textTransform: 'none', // Disabling text transformation for MuiButton
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#0866ff' // Defining the main color for the primary palette
    },
  },
});

// Rendering the application inside the root element
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrapping the entire application with ThemeProvider to provide the custom theme */}
    <ThemeProvider theme={theme}>
      <App /> {/* Rendering the main App component */}
    </ThemeProvider>
  </React.StrictMode>,
);
