import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

export default function Footer(){
  return (
    <footer className="mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">
        <h3 className="text-2xl font-semibold">Get the best from Tomato<br/>Download our mobile app</h3>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Link to="/mobile-app" className="app-badge" aria-label="Google Play">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
          </Link>
          <Link to="/mobile-app" className="app-badge" aria-label="App Store">
            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10" />
          </Link>
        </div>
      </div>

      <div className="footer-dark">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div>
            <div className="text-2xl font-extrabold text-orange-400">Tomato.</div>
            <p className="mt-3 text-sm text-gray-300">Order food from local restaurants with fast delivery and exclusive deals. Simple, fast, and delicious.</p>
            <div className="mt-4 flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social">f</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social">t</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social">in</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">COMPANY</h4>
            <ul className="text-gray-300 text-sm space-y-2">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/contact">Delivery</Link></li>
              <li><Link to="/contact">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">GET IN TOUCH</h4>
            <div className="text-gray-300 text-sm">+91 8379980265</div>
            <div className="text-gray-300 text-sm mt-2">virbhadrakhobare111@gmail.com</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
