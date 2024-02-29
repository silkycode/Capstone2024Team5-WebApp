import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import TitleLogo from '../assets/images/svgs/title-removebg-preview.png';
import HelpIcon from '../assets/images/svgs/round-help-button-svgrepo-com.svg';
import ContactIcon from '../assets/images/svgs/speech-bubbles-svgrepo-com.svg';
import OrdersIcon from '../assets/images/svgs/text-documents-svgrepo-com.svg';
import ProfileIcon from '../assets/images/svgs/profile-button.svg';

const Header = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  return (
    <header>
      <div className="company-info" onClick={() => navigate('/')}>
        <img src={TitleLogo} alt="Company Logo" />
      </div>
      <nav>
        <Link to="/help" className="nav-item" onClick={() => navigate('/help')}>
          <img src={HelpIcon} alt="Help Icon" />
          Help
        </Link>
        <Link to="/contact" className="nav-item" onClick={() => navigate('/contact')}>
          <img src={ContactIcon} alt="Contact Icon" />
          Contact Us
        </Link>
        <Link to="/orders" className="nav-item" onClick={() => navigate('/orders')}>
          <img src={OrdersIcon} alt="Orders Icon" />
          My Orders
        </Link>
        <Link to={isLoggedIn ? "/profile" : "/login"} className="nav-item" onClick={() => navigate('/profile')}>
          <img src={ProfileIcon} alt="Profile Icon" />
          Profile
        </Link>
      </nav>
    </header>
  );
};

export default Header;