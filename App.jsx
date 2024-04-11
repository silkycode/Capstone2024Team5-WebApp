import React, { useState } from 'react'; // Importing React and useState hook
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Importing necessary components from react-router-dom

// Importing Components
import Header from './components/Header'; // Header component
import Login from './components/Login'; // Login component
import HelpInfo from './components/HelpInfo'; // HelpInfo component
import Contact from './components/Contact'; // Contact component
import Dashboard from './components/Dashboard'; // Dashboard component
import Registration from './components/Registration'; // Registration component
import ForgotPassword from './components/ForgotPassword'; // ForgotPassword component
import GlucoseLogs from './components/GlucoseLogs'; // GlucoseLogs component
import Profile from './components/Profile'; // Profile component
import Appointment from './components/Appointment'; // Appointment component
import Notifications from './components/Notifications'; // Notifications component
import MedicalForms from './components/MedicalForms'; // MedicalForms component
import Products from './components/products'; // Products component

// Main functional component AimPlusMedicalSupplies
export default function AimPlusMedicalSupplies() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track user's login status
  const [username, setUsername] = useState(''); // State to store the username

  return (
    <Router>
      <div>
        {/* Header component */}
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        
        <Routes>
          {/* Route for the home page, redirects to dashboard if logged in, otherwise shows login component */}
          <Route path="/" element={isLoggedIn ? <Navigate to='/dashboard'/> : <Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername}/>} />
          
          {/* Route for dashboard and its child routes */}
          <Route path="/dashboard/*" element={isLoggedIn ? <Dashboard username={username}/> : <Navigate to="/" />} >
            {/* Child routes of dashboard */}
            <Route path="profile" element={<Profile />} />
            <Route path="glucose-logs" element={<GlucoseLogs />} />
            <Route path="appointments" element={<Appointment />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="medical-forms" element={<MedicalForms />} />
            <Route path="products" element={<Products />} />
          </Route>
          
          {/* Route for help page */}
          <Route path="/help" element={<HelpInfo />} />
          
          {/* Route for forgot password page */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Route for registration page */}
          <Route path="/registration" element={<Registration />} />
          
          {/* Route for contact page */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  )
}
