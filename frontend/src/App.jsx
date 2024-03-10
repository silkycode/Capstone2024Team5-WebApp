import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Components
import Header from './components/Header';
import Login from './components/Login';
import HelpInfo from './components/HelpInfo';
import MedicalForms from './components/MedicalForms';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import Registration from './components/Registration';
import ForgotPassword from './components/ForgotPassword';

function AimPlusMedicalSupplies() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <Header isLoggedIn={isLoggedIn} />
        <Routes>
          <Route 
            path="/" 
            element={isLoggedIn ? 
              <Navigate to='/dashboard'/> : 
              <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />  
          <Route path="/help" element={<HelpInfo />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/forms" element={<MedicalForms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  )
}

export default AimPlusMedicalSupplies;