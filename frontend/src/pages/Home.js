import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';
import '../styles/home.css';
import TopDishes from '../components/TopDishes';
import CategoryPill from '../components/CategoryPill';
import { useToast } from '../components/ToastProvider';

export default function Home(){
  const heroImage = 'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=1600&q=80&auto=format&fit=crop';
  const [searchQuery, setSearchQuery] = useState('');
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const toast = useToast ? useToast() : null;

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allDishes, setAllDishes] = useState([]);

  const mountedRef = useRef(false);

  const fetchDishes = useCallback(async ({ maxAttempts = 4, baseDelay = 500 } = {})=>{
    mountedRef.current = true;
    setLoading(true);
    setError(null);
    setRetryCount(0);
    // try up to maxAttempts with exponential backoff
    for(let attempt=1; attempt<=maxAttempts; attempt++){
      if(!mountedRef.current) break;
      setRetryCount(attempt-1);
      try{
        const url = API_BASE + '/dishes?popular=true';
  const r = await axios.get(url, { timeout: 5000 });
  if(!mountedRef.current) return;
  setPopular((r.data || []).slice(0,6));
  setError(null);
  setRetryCount(0);
  setLoading(false);
  return;
      }catch(err){
        console.warn(`Primary fetch attempt ${attempt} failed:`, err && err.toString ? err.toString() : err);
      }

      // try fallback on the same attempt
      try{
        const fallback = (API_BASE && API_BASE.startsWith('http')) ? API_BASE + '/dishes?popular=true' : 'http://localhost:5000/api/dishes?popular=true';
  const r2 = await axios.get(fallback, { timeout: 5000 });
  if(!mountedRef.current) return;
  setPopular((r2.data || []).slice(0,6));
  setError(null);
  setRetryCount(0);
  setLoading(false);
  return;
      }catch(err2){
        console.warn(`Fallback fetch attempt ${attempt} failed:`, err2 && err2.toString ? err2.toString() : err2);
      }

      // if not last attempt, wait with exponential backoff then retry
      if(attempt < maxAttempts){
        const delay = baseDelay * Math.pow(2, attempt-1);
        // show a transient message to the user (not an error)
        if(mountedRef.current) setError(`Unable to contact backend — retrying (attempt ${attempt + 1} of ${maxAttempts})...`);
        await new Promise(res => setTimeout(res, delay));
        continue;
      }

      // all attempts exhausted
      if(!mountedRef.current) break;
      setError('Failed to load popular dishes. The backend may be unreachable — ensure the server is running and try again.');
      setRetryCount(0);
      setLoading(false);
      return;
    }
    if(mountedRef.current) setLoading(false);
  },[]);

  useEffect(()=>{
    mountedRef.current = true;
    fetchDishes();
    // fetch categories (small list) to render the circular pills on the home page
    (async function loadCategories(){
      try{
        const r = await axios.get(API_BASE + '/dishes');
        const dishes = r.data || [];
        setAllDishes(dishes);
        const map = new Map();
        dishes.forEach(d=>{
          const key = (d.category || 'Other');
          const cur = map.get(key) || { name: key, image: d.imageURL, count: 0 };
          cur.count++;
          if(!cur.image && d.imageURL) cur.image = d.imageURL;
          map.set(key, cur);
        });
        setCategories([{ name: 'All', count: dishes.length }, ...Array.from(map.values())]);
      }catch(e){
        // ignore categories failure silently
      }
    })();
    return ()=> { mountedRef.current = false; };
  },[fetchDishes]);

  function handleSubscribe(e){
    e.preventDefault();
    if(toast && toast.add) toast.add('Thanks — you are subscribed for updates');
  }

  function handleSearchSubmit(e){
    e.preventDefault();
    if(!searchQuery || searchQuery.trim() === ''){
      // navigate to general menu
      navigate('/menu');
      return;
    }
    navigate('/menu?search=' + encodeURIComponent(searchQuery.trim()));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 pb-16">
        <div className="relative rounded-xl overflow-hidden mt-6 hero-card">
          <img loading="lazy" src={heroImage} alt="hero" className="w-full h-80 md:h-96 object-cover block" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-2xl p-8 md:p-12 text-white">
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Order your<br/>favourite food here</h1>
              <p className="mt-4 text-sm md:text-base text-white/85">Fast delivery, trusted restaurants, and secure payments. Eat well — every day.</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <form onSubmit={handleSearchSubmit} className="w-full sm:flex sm:items-center">
                  <input
                    aria-label="Search dishes or restaurants"
                    value={searchQuery}
                    onChange={e=> setSearchQuery(e.target.value)}
                    placeholder="Search dishes or restaurants (e.g. biryani, dosa)"
                    className="w-full md:w-[520px] p-3 rounded-l-full rounded-r-full sm:rounded-r-none border-0 focus:outline-none"
                  />
                  <button type="submit" className="hidden sm:inline-block ml-2 bg-white text-orange-600 font-semibold px-5 py-2 rounded-full shadow">Search</button>
                </form>
                <Link to="/menu" className="inline-block sm:ml-3 mt-2 sm:mt-0 bg-white text-orange-600 font-semibold px-5 py-2 rounded-full shadow">View Menu</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Promo banner */}
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-gradient-to-r from-orange-50 to-white border rounded-lg py-3 px-4 flex items-center justify-between">
            <div>
              <strong className="text-orange-600">Free delivery</strong> on orders over <strong>₹500</strong> · Use code <span className="font-semibold">FREESHIP</span>
            </div>
            <div className="text-sm text-gray-600">Limited time offer</div>
          </div>
        </div>

          {/* Categories (circular) */}
          {categories && categories.length > 0 && (
            <section className="mt-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-6 items-center justify-center flex-wrap py-4">
                  {categories.map((c, idx) => (
                    <div key={idx} className="flex-shrink-0">
                      <CategoryPill category={c} layout="vertical" imageClass="w-16 h-16" onClick={(name)=> navigate('/menu?category=' + encodeURIComponent(name))} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Features */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3 className="feature-title">Fast delivery</h3>
            <p className="feature-desc">Lightning-fast delivery from local restaurants to your door.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3 className="feature-title">Secure payments</h3>
            <p className="feature-desc">Pay with card or wallet — payments protected with Stripe.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3 className="feature-title">Top-rated restaurants</h3>
            <p className="feature-desc">We partner with the best local kitchens in your city.</p>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="feature-card">
              <div className="feature-icon">🔎</div>
              <h4 className="feature-title">Browse</h4>
              <p className="feature-desc">Find dishes, filter by category, and compare ratings.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h4 className="feature-title">Order</h4>
              <p className="feature-desc">Add to cart, choose variants, and checkout in seconds.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h4 className="feature-title">Enjoy</h4>
              <p className="feature-desc">Fresh food delivered hot — enjoy your meal!</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">What our customers say</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="feature-card">
              <div className="text-lg">“Great variety and quick delivery — my go-to for dinner.”</div>
              <div className="mt-3 text-sm text-gray-600">— Priya K.</div>
            </div>
            <div className="feature-card">
              <div className="text-lg">“The app is so easy to use and the food quality is excellent.”</div>
              <div className="mt-3 text-sm text-gray-600">— Rohan M.</div>
            </div>
            <div className="feature-card">
              <div className="text-lg">“Love the discounts and fast support when needed.”</div>
              <div className="mt-3 text-sm text-gray-600">— Aisha S.</div>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="mt-8">
          <div className="flex flex-wrap gap-4 items-center justify-center text-sm text-gray-600">
            <div className="px-3 py-2 bg-white rounded shadow-sm">Secure payments</div>
            <div className="px-3 py-2 bg-white rounded shadow-sm">24/7 Support</div>
            <div className="px-3 py-2 bg-white rounded shadow-sm">Easy refunds</div>
            <div className="px-3 py-2 bg-white rounded shadow-sm">Top-rated kitchens</div>
          </div>
        </section>

        {/* Popular dishes (polished UX via TopDishes) */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Popular dishes</h2>
            <Link to="/menu" className="text-sm text-gray-500">See all</Link>
          </div>
          <div className="mt-6">
            <TopDishes dishes={popular} loading={loading} error={error} onRetry={fetchDishes} onAdd={null} />
          </div>
        </section>

  {/* Circular dishes explorer */}
  {Array.isArray(allDishes) && allDishes.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Explore dishes</h2>
              <Link to="/menu" className="text-sm text-gray-500">See menu</Link>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-6 circular-grid">
                {allDishes.slice(0, 40).map(d => (
                  <div key={d._id} className="circle-dish" onClick={() => navigate('/dish/' + d._id)} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') navigate('/dish/' + d._id); }}>
                      <div className="circle-thumb">
                      <img loading="lazy" src={d.imageURL || '/images/placeholder.svg'} alt={d.name} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="circle-label">{d.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA / Newsletter */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-xl font-semibold">Get exclusive offers</h3>
            <p className="text-gray-600 mt-2">Join our newsletter and get app-only discounts and curated picks — delivered weekly.</p>
          </div>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input aria-label="email" type="email" placeholder="Your email address" required className="newsletter-input" />
            <button className="newsletter-btn">Subscribe</button>
          </form>
        </section>

      </main>
    </div>
  );
}
