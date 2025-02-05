// src/components/SplashScreen.js
import React from 'react';
import './SplashScreen.css';

const SplashScreen = () => (
  <div className="splash-screen">
    <div className="spinner"></div>
    <h2 style={{ color: "black" }}>Generating Notes...</h2>
  </div>
);

export default SplashScreen;
