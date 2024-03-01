import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import Header from './components/Header'
import LoginForm from './components/LoginForm'
import HelpInfo from './components/HelpInfo'
import MedicalForms from './components/MedicalForms'
import Contact from './components/Contact'
import Dashboard from './components/Dashboard';

function AimPlusMedicalSupplies() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <Header isLoggedIn={isLoggedIn} />
        <Routes>
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to='/dashboard'/> : <LoginForm setIsLoggedIn={setIsLoggedIn} />} />
          <Route path ="/dashboard" element={<Dashboard />} />  
          <Route path="/help" element={<HelpInfo />} />
          <Route path="/forms" element={<MedicalForms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  )
}

export default AimPlusMedicalSupplies;