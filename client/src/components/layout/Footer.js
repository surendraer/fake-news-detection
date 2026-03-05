import React from 'react';
import { Link } from 'react-router-dom';
import { HiShieldCheck } from 'react-icons/hi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            <div className="footer-brand-icon">
              <HiShieldCheck />
            </div>
            VerifyNews
          </div>
          <p className="footer-desc">
            AI-powered fake news detection platform. Analyze any news article
            and get an instant credibility assessment using advanced machine
            learning and natural language processing.
          </p>
        </div>

        <div>
          <h4 className="footer-title">Product</h4>
          <ul className="footer-links">
            <li><Link to="/analyze">Analyze News</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/history">History</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Resources</h4>
          <ul className="footer-links">
            <li><a href="https://www.kaggle.com/c/fake-news/data" target="_blank" rel="noopener noreferrer">Dataset</a></li>
            <li><a href="https://scikit-learn.org/" target="_blank" rel="noopener noreferrer">Scikit-Learn</a></li>
            <li><a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a></li>
            <li><a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Legal</h4>
          <ul className="footer-links">
            <li><Link to="/about">Privacy Policy</Link></li>
            <li><Link to="/about">Terms of Service</Link></li>
            <li><Link to="/about">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>2026 VerifyNews. All rights reserved.</span>
        <span>Built with React, Node.js, and Machine Learning</span>
      </div>
    </footer>
  );
};

export default Footer;
