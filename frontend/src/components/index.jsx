import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from './Login'; 
import PatientDashboard from './PatientDashboard'; 

function AimPlusMedicalSupplies() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Route exact path="/">
        <Login setIsLoggedIn={setIsLoggedIn} />
      </Route>
      <Route path="/dashboard">
        {isLoggedIn ? <PatientDashboard /> : <Redirect to="/" />}
      </Route>
    </Router>
  );
}

export default AimPlusMedicalSupplies;