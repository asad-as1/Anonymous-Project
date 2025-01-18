import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>We help you manage your contacts efficiently and stay connected with the people who matter most.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contacts">Contacts</Link></li>
            <li><Link to="/newcontact">Add Contact</Link></li>
            <li><Link to="/">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li>Email: info@contactsapp.com</li>
            <li>Phone: (555) 123-4567</li>
            <li>Address: 123 App Street</li>
            <li>City, State 12345</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-links">
            <Link to='/' className="social-link">Facebook</Link>
            <Link to='/' className="social-link">Twitter</Link>
            <Link to='/' className="social-link">LinkedIn</Link>
            <Link to='/' className="social-link">Instagram</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Contacts App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;