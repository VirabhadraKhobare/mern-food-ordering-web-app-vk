import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/mobile.css';

export default function MobileBottomNav(){
  const items = useSelector(s => s.cart.items || []);
  const count = items.reduce((s,i)=> s + (i.quantity || 0), 0);

  return (
    <nav className="mobile-bottom-nav md:hidden">
      <Link to="/" className="nav-item" aria-label="Home">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"/></svg>
        <span>Home</span>
      </Link>
      <Link to="/menu" className="nav-item" aria-label="Menu">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
        <span>Menu</span>
      </Link>

      <Link to="/mobile-app" className="nav-cta" aria-label="Mobile app">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M18.07 19.07l-4.24-4.24M2 12h6M22 12h-6"/></svg>
        <span>App</span>
      </Link>

      <Link to="/cart" className="nav-item" aria-label="Cart" style={{ position: 'relative' }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7"/></svg>
        {count > 0 && <span className="nav-badge" style={{ position:'absolute', top:2, right:6, background:'#ef4444', color:'#fff', fontSize:10, padding:'2px 6px', borderRadius:12 }}>{count}</span>}
        <span>Cart</span>
      </Link>
      <Link to="/profile" className="nav-item" aria-label="Profile">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804z"/></svg>
        <span>Profile</span>
      </Link>
    </nav>
  );
}
