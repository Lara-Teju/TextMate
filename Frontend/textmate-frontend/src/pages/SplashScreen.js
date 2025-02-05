/* src/pages/SplashScreen.js */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';
import logo from '../assets/logo.png';

const SplashScreen = () => { 
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate('/home'), 3000);
  }, [navigate]);

  return (
    <div className="splash-container">
      <img src={logo} alt="Logo" className="pulse-logo" />
    </div>
  );
};

export default SplashScreen;