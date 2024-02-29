import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from '../assets/images/svgs/white-go-back-button.png';

const Contact = () => {
    const navigate = useNavigate();
    return (
        <div className="container">
            <button className="go-back-btn" onClick={() => navigate('/')}>
                <img src={BackButton} width="15px" height="12px" alt="Go Back Icon"/>
                Go Back
            </button>
            <h1>Contact</h1>
            <div className="contact-info">
                <h2>Our Address:</h2>
                <p>6521 AL Hwy 69 S, Suit N,</p>
                <p>Tuscaloosa, AL 35405</p>

                <h2>Phone:</h2>
                <p>(866)-919-1246</p>
                <h2>Email:</h2>
                <p>info@aimplusmedicalsupplies.com</p>
                <p>aimplusmedicalsupplies.com</p>
            </div>
        </div>
    );
};

export default Contact;