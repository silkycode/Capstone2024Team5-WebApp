import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from '../assets/images/svgs/white-go-back-button.png';

const MedicalForms = () => {
    const navigate = useNavigate();
    return (
        <div className="container">
            <button className="go-back-btn" onClick={() => navigate('/')}>
                <img src={BackButton} width="15px" height="12px" alt="Go Back Icon"/>
                Go Back
            </button>
            <h1>Medical Forms</h1>
            <div className="product-list">
                <div className="product-card">
                    <h2>Certificate of Medical Necessity (CMN)</h2>
                    <p>Form required for patients on <strong>Medicaid or Commercial</strong> insurance.</p>
                    <a href="../assets/PDF/AIM-Medicaid_Commericial-CMN-11_23.pdf" className="download-link" download>Download PDF</a>
                </div>
            </div>
            <div className="product-list">
                <div className="product-card">
                    <h2>Certificate of Medical Necessity (CMN)</h2>
                    <p>Form required for patients on <strong>Medicare</strong> insurance.</p>
                    <a href="../assets/PDF/AIM-Medicare-CMN-5_9_23.pdf" className="download-link" download>Download PDF</a>
                </div>
            </div>
        </div>
    );
};

export default MedicalForms