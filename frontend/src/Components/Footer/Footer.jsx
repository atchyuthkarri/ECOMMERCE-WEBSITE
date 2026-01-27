import React from 'react';
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      {/* Logo */}
      <div className="footer-logo">
        <p>Storely</p>
      </div>

      {/* Footer Links */}
      <ul className="footer-links">
        <li><a href="/company">Company</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/offices">Offices</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>

      {/* Social Icons */}
      <div className="footer-social-icon">
        {/* Instagram */}
        <a className="socialContainer containerOne" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 16 16" className="socialSvg instagramSvg">
            <path d="M8 0C5.829 0 5.556.01 4.703.048 ... (rest of your path)" />
          </svg>
        </a>

        {/* Twitter */}
        <a className="socialContainer containerTwo" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 16 16" className="socialSvg twitterSvg">
            <path d="M5.026 15c6.038 0 9.341-5.003 ... (rest of your path)" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a className="socialContainer containerThree" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 448 512" className="socialSvg linkdinSvg">
            <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 ..." />
          </svg>
        </a>

        {/* WhatsApp */}
        <a className="socialContainer containerFour" href="https://wa.me/" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 16 16" className="socialSvg whatsappSvg">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0 ..." />
          </svg>
        </a>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2025 - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;