import React, { useEffect, useState, useRef } from 'react';
import '../styles/mobile.css';

const SAMPLE_TRENDING = [
  { id: 1, name: 'Margherita Pizza', meta: 'Hot & Cheesy', img: '/public/images/idli-sambar.avif', orders: 124 },
  { id: 2, name: 'Masala Dosa', meta: 'Crispy & Spicy', img: '/public/images/idli-sambar.avif', orders: 98 },
  { id: 3, name: 'Caesar Salad', meta: 'Fresh & Light', img: '/public/images/idli-sambar.avif', orders: 72 },
  { id: 4, name: 'Butter Chicken', meta: 'Creamy Special', img: '/public/images/idli-sambar.avif', orders: 64 }
];

export default function MobileApp(){
  const [trending, setTrending] = useState(SAMPLE_TRENDING);
  const [active, setActive] = useState(0);

  const FEATURES = [
    { id: 1, title: 'Quick Re-order', desc: 'Save favorites & reorder in one tap.' },
    { id: 2, title: 'Live ETA', desc: 'Real-time tracking & delivery ETAs.' },
    { id: 3, title: 'Secure Payments', desc: 'Cards and wallets with strong encryption.' },
    { id: 4, title: 'Personalized', desc: 'Smart recommendations based on your taste.' }
  ];

  const TESTIMONIALS = [
    { id: 1, name: 'Asha R.', text: 'Fast delivery and great discounts — I use Tomato daily!', role: 'Regular customer' },
    { id: 2, name: 'Ravi K.', text: 'Owner dashboard made managing orders so much easier.', role: 'Partner restaurant' },
    { id: 3, name: 'Maya S.', text: 'Checkout is so smooth — love the saved cards feature.', role: 'Happy user' }
  ];

  const SCREENSHOTS = [
    '/images/idli-sambar.avif',
    '/images/idli-sambar.avif',
    '/images/idli-sambar.avif'
  ];

  const [testiIndex, setTestiIndex] = useState(0);
  const testiRef = useRef(0);

  // Small simulated 'real-time' activity: rotate highlights every 3s
  const activeRef = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      setTrending((prev) => {
        if (!prev || prev.length === 0) return prev;
        const next = (activeRef.current + 1) % prev.length;
        activeRef.current = next;
        const bumped = prev.map((it, i) => (i === next ? { ...it, orders: it.orders + Math.round(Math.random() * 3) } : it));
        // update visible active index
        setActive(next);
        return bumped;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // rotate testimonials every 4.5s
  useEffect(() => {
    const id = setInterval(() => {
      testiRef.current = (testiRef.current + 1) % TESTIMONIALS.length;
      setTestiIndex(testiRef.current);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mobile-app-page container-hero">
      <div className="hero-inner">
        <div className="hero-left">
          <h1 className="title">Tomato — Mobile App</h1>
          <p className="lead">Get faster checkout, live order tracking, exclusive deals and personalized recommendations — all in one lightweight app.</p>

          <ul className="feature-list modern">
            <li><strong>One-tap re-order</strong> — reorder your favorites in a single tap.</li>
            <li><strong>Live tracking</strong> — watch your order move from kitchen to doorstep in real time.</li>
            <li><strong>App-only rewards</strong> — unlock discounts, loyalty points and limited offers.</li>
            <li><strong>Save cards & addresses</strong> — checkout faster with secure storage.</li>
            <li><strong>Owner dashboard</strong> — partner restaurants get insights and quick order management.</li>
          </ul>

          <div className="badges-row">
            <a href="#" className="app-badge" aria-label="Google Play">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
            </a>
            <a href="#" className="app-badge" aria-label="App Store">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
            </a>
          </div>
          
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.id} className="feature-card">
                <div className="feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#F97316" opacity="0.12"/><path d="M12 6v6l4 2" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div className="fc-title">{f.title}</div>
                  <div className="fc-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-right">
          <div className="preview-and-qr">
            <div className="mock-phone">
              <picture>
                <source srcSet="/screenshot.svg" type="image/svg+xml" />
                <img loading="lazy" src="/screenshot.png" alt="Tomato app preview" onError={(e)=> { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/240x480?text=App+Preview'; }} />
              </picture>
            </div>
            <div className="qr-and-note">
              <div className="qr-box">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://example.com" alt="qr" />
              </div>
              <div className="qr-note">Scan to install</div>
            </div>
          </div>

          <div className="trending-panel">
            <div className="trending-header">
              <h3>Trending right now</h3>
              <span className="live-dot" aria-hidden />
            </div>
            <div className="trending-list">
              {trending.map((item, idx) => (
                <div key={item.id} className={`trending-card ${idx === active ? 'active' : ''}`}>
                  <div className="thumb">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="meta">
                    <div className="name">{item.name}</div>
                    <div className="sub">{item.meta}</div>
                  </div>
                  <div className="stats">
                    <div className="orders">{item.orders}</div>
                    <div className="badge">Trending</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="testimonials">
            <div className="testi-card">
              <div className="testi-text">“{TESTIMONIALS[testiIndex].text}”</div>
              <div className="testi-author">{TESTIMONIALS[testiIndex].name} — <span className="muted">{TESTIMONIALS[testiIndex].role}</span></div>
            </div>
          </div>

          <div className="screenshots">
            {SCREENSHOTS.map((s, i) => (
              <div key={i} className="ss-thumb">
                <img src={s} alt={`screenshot-${i}`} />
              </div>
            ))}
          </div>

          <div className="cta-strip">
            <div className="cta-inner">
              <div className="cta-copy">Get exclusive app deals and faster checkout. Download Tomato now.</div>
              <div className="cta-actions">
                <button className="cta-btn">Download the app — Free</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="app-footer">App name: <strong>Tomato</strong> — Version: <strong>1.0.0</strong></div>
    </div>
  );
}
