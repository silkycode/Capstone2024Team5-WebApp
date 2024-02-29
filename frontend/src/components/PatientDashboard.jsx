import React, { useEffect, useState } from 'react';

function PatientDashboard() {
  // Define state variables for patient data and alerts
  const [patientData, setPatientData] = useState({
    name: "John Doe",
    lastVisitDate: "January 15, 2023",
    alerts: ["Glucose logs overdue", "Next doctor visit approaching"]
  });

  // Function to handle button click events
  const handleClick = (action) => {
    switch (action) {
      case 'viewHistory':
        alert('View History clicked!');
        // Add logic for viewing history
        break;
      case 'logGlucose':
        alert('Log Glucose clicked!');
        // Add logic for logging glucose
        break;
      case 'viewStatus':
        alert('View Status clicked!');
        // Add logic for viewing status
        break;
      case 'viewProducts':
        // Redirect to the product page
        window.location.href = 'product.html';
        break;
      case 'viewMedicalForms':
        // Redirect to the medical forms page
        window.location.href = 'medical-forms.html';
        break;
      default:
        break;
    }
  };

  // Render the component
  return (
    <div>
      <h2>Welcome, {patientData.name}!</h2>
      <p>Last visit date: {patientData.lastVisitDate}</p>

      <button onClick={() => handleClick('viewHistory')}>View History</button>
      <button onClick={() => handleClick('logGlucose')}>Log Glucose</button>
      <button onClick={() => handleClick('viewStatus')}>View Status of Current</button>
      <button onClick={() => handleClick('viewProducts')}>View Products</button>
      <button onClick={() => handleClick('viewMedicalForms')}>View Medical Forms</button>

      <h2>Alerts:</h2>
      <ul>
        {patientData.alerts.map((alert, index) => (
          <li key={index}>{alert}</li>
        ))}
      </ul>
    </div>
  );
}

export default PatientDashboard;
