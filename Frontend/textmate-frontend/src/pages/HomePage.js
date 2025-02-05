/* src/pages/HomePage.js */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from '../assets/logo.png';

const HomePage = () => {

  useEffect(() => {
    const TxtType = function (el, toRotate, period) {
      this.toRotate = toRotate;
      this.el = el;
      this.loopNum = 0;
      this.period = parseInt(period, 10) || 2000;
      this.txt = '';
      this.isDeleting = false;
      this.tick();
    };

    TxtType.prototype.tick = function () {
      let i = this.loopNum % this.toRotate.length;
      let fullTxt = this.toRotate[i];

      this.txt = this.isDeleting
        ? fullTxt.substring(0, this.txt.length - 1)
        : fullTxt.substring(0, this.txt.length + 1);

      this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

      let that = this;
      let delta = 200 - Math.random() * 100;

      if (this.isDeleting) delta /= 2;
      if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
      }

      setTimeout(() => that.tick(), delta);
    };

    const elements = document.getElementsByClassName('typewrite');
    for (let i = 0; i < elements.length; i++) {
      let toRotate = elements[i].getAttribute('data-type');
      let period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }
  }, []);

  return (
    <div className="home-container">
      {/* Floating Doodles */}
      <div className="floating-elements">
      <img src={logo} alt="book-icon" />
      </div>

      {/* Animated Typing Text */}
{/* Animated Typing Text */}
<h1 className="typing-text">
  <span
    className="typewrite"
    data-period="2000"
    data-type='["Welcome to TextMate.", "Organize Your Notes Easily.", "Learn Efficiently."]'
  >
    <span className="wrap"></span>
  </span>
</h1>



      {/* Buttons */}
      <div className="button-group">
        <Link to="/create" className="button create-button">Create Notes</Link>
        <Link to="/notes" className="button view-button">View Notes</Link>
      </div>
    </div>
  );
};

export default HomePage;


