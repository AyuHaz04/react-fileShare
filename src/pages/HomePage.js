import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="App">

      <header className="hero-section">
        <h1>Digitally Secure and Share<br />Your Government Documents</h1>
        <div className="hero-buttons">
          <Link to="/register"><button className="btn-register">Register Now</button></Link>
          <Link to="/login"><button className="btn-login">Login</button></Link>
        </div>
      </header>

      <section className="features">
        <div className="feature">
          <img src="https://img.icons8.com/ios-filled/50/upload.png" alt="Upload" />
          <p>Upload & Store Safely</p>
        </div>
        <div className="feature">
          <img src="https://img.icons8.com/ios-filled/50/conference-call.png" alt="Family" />
          <p>Share with Family</p>
        </div>
        <div className="feature">
          <img src="https://img.icons8.com/ios-filled/50/shield--v1.png" alt="Security" />
          <p>Aadhaar-Linked Security</p>
        </div>
        <div className="feature">
          <img src="https://img.icons8.com/ios-filled/50/internet--v1.png" alt="Anywhere" />
          <p>Access Anytime, Anywhere</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;