import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from '../assets/images/svgs/white-go-back-button.png';

const HelpInfo = () => {
    const navigate = useNavigate();
    return (
        <div className="container">
            <button className="go-back-btn" onClick={() => navigate('/')}>
                <img src={BackButton} width="15px" height="12px" alt="Go Back Icon"/>
                Go Back
            </button>
            <h1>Help</h1>
            <div className="help-content">
                <h2>FAQs (Frequently Asked Questions)</h2>
                <p>
                    <strong>Q: How do I place an order?</strong>
                    <br />
                    A: To place an order, please follow these steps:
                    <br />
                    1. Log in to your account.
                    <br />
                    2. Browse the products and add items to your cart.
                    <br/>
                    3. Proceed to checkout and complete the payment process.
                </p>
                <p>
                    <strong>Q: How can I track my order?</strong>
                    <br />
                    A: You can track your order by logging in to your account and checking the order status in the "My Orders" section.
                </p>
                <p>
                    <strong>Q: What payment methods do you accept?</strong>
                    <br />
                    A: We accept credit/debit cards, PayPal, and bank transfers as payment methods.
                </p>
            </div>
        </div>
    );
};

export default HelpInfo;