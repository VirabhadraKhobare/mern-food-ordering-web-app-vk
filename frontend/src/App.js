import React, {useState} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Menu from './pages/Menu';
import DishDetails from './pages/DishDetails';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OwnerDashboard from './pages/OwnerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ToastProvider from './components/ToastProvider';
import MobileApp from './pages/MobileApp';
export default function App(){
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const items = useSelector(s => s.cart.items || []);
  const cartCount = items.reduce((s,i)=> s + (i.quantity || 0), 0);
  const user = useSelector(s => s.auth.user);
  return (
    <ToastProvider>
    <BrowserRouter>
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* left: logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="text-2xl font-extrabold text-orange-500">Tomato.</Link>
              <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                <Link to="/" className="hover:text-orange-500">home</Link>
                <Link to="/menu" className="hover:text-orange-500">menu</Link>
                <Link to="/mobile-app" className="hover:text-orange-500">mobile-app</Link>
                {user?.role === 'owner' && <Link to="/owner" className="hover:text-orange-500">owner dashboard</Link>}
                {/* checkout removed - link intentionally omitted */}
                <Link to="/contact" className="hover:text-orange-500">contact us</Link>
              </nav>
            </div>

            {/* right: icons + actions */}
            <div className="flex items-center gap-4">
              <button aria-label="search" className="p-2 rounded-full hover:bg-gray-100 hidden md:inline-flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                </svg>
              </button>
              <Link to="/cart" aria-label="cart" className="p-2 rounded-full hover:bg-gray-100 hidden md:inline-flex" style={{ position: 'relative' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                {cartCount > 0 && <span style={{ position:'absolute', top:0, right:0, transform:'translate(40%,-30%)', background:'#ef4444', color:'#fff', fontSize:11, padding:'2px 6px', borderRadius:12 }}>{cartCount}</span>}
              </Link>

              <button onClick={()=>setShowLogin(true)} className="text-sm px-4 py-1.5 rounded-full border border-orange-400 text-orange-500 hover:bg-orange-50">sign in</button>
              <button onClick={()=>setShowSignup(true)} className="text-sm px-4 py-1.5 rounded-full bg-orange-500 text-white hidden md:inline-flex">Create account</button>
            </div>
          </div>
        </div>
      </header>
      {showLogin && <LoginModal onClose={()=>setShowLogin(false)} onSwitchToSignup={()=>{ setShowLogin(false); setShowSignup(true); }} />}
      {showSignup && <SignupModal onClose={()=>setShowSignup(false)} onSwitchToLogin={()=>{ setShowSignup(false); setShowLogin(true); }} />}
      <Routes>
  <Route path="/" element={<Home/>} />
  <Route path="/menu" element={<Menu/>} />
      <Route path="/mobile-app" element={<MobileApp/>} />
  <Route path="/cart" element={<Cart/>} />
  <Route path="/contact" element={<Contact/>} />
  <Route path="/payment" element={<Payment/>} />
        <Route path="/dish/:id" element={<DishDetails/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
                <Route path="/owner/*" element={<ProtectedRoute role={'owner'}><OwnerDashboard/></ProtectedRoute>} />
      </Routes>
      <MobileBottomNav />
      <Footer />
    </BrowserRouter>
    </ToastProvider>
  );
}
