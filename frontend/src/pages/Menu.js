import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { Link, useLocation } from 'react-router-dom';
import '../styles/menu.css';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import TopDishes from '../components/TopDishes';
import DishGrid from '../components/DishGrid';
import CategoryPill from '../components/CategoryPill';
import { useToast } from '../components/ToastProvider';

export default function Menu(){
  const [dishes, setDishes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(()=>{ axios.get(API_BASE + '/dishes').then(r=> setDishes(r.data)).catch(()=>{}); },[]);

  // initialize active category from query param (e.g. ?category=Indian)
  useEffect(()=>{
    const qp = new URLSearchParams(location.search);
    const cat = qp.get('category');
    if(cat) setActiveCategory(cat);
  },[location.search]);

  // categories with counts
  const categories = React.useMemo(()=>{
    const map = new Map();
    dishes.forEach(d=>{
      const key = (d.category || 'Other');
      const cur = map.get(key) || { name: key, image: d.imageURL, count: 0 };
      cur.count++;
      if(!cur.image && d.imageURL) cur.image = d.imageURL;
      map.set(key, cur);
    });
    return [{ name: 'All', count: dishes.length }, ...Array.from(map.values())];
  },[dishes]);

  const topDishes = React.useMemo(()=> {
    const popular = dishes.filter(d=>d.isPopular).slice(0,8);
    return popular.length ? popular : dishes.slice(0,8);
  },[dishes]);

  function formatPrice(p){ return typeof p === 'number' ? p.toFixed(2) : p; }

  function renderStars(rating=4.5){
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half?1:0);
    const stars = [];
    for(let i=0;i<full;i++) stars.push(<span key={'f'+i} className="text-yellow-500">★</span>);
    if(half) stars.push(<span key={'h'} className="text-yellow-500">☆</span>);
    for(let i=0;i<empty;i++) stars.push(<span key={'e'+i} className="text-gray-300">★</span>);
    return <span className="ml-1">{stars}</span>;
  }

  const filtered = activeCategory === 'All' ? dishes : dishes.filter(d=> (d.category||'Other') === activeCategory);

  const toast = useToast ? useToast() : null;
  function handleAdd(dish, variant){
    const sel = variant || (dish.availableTypes && dish.availableTypes[0]) || dish.type || null;
    dispatch(addItem({ dishId: dish._id, quantity: 1, variant: sel }));
    if(toast && toast.add) toast.add(`${dish.name} added to cart`);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold">Explore Our Menu</h1>
        <p className="mx-auto mt-3 max-w-3xl text-sm text-gray-600">Choose from fresh dishes prepared by local restaurants. Use the categories to filter and tap a dish to see details.</p>
      </header>

      {/* Hero banner with image */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <div className="relative h-44 md:h-64 bg-gray-100 rounded-lg overflow-hidden">
          <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1400&q=80&auto=format&fit=crop" alt="Delicious food" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl md:text-4xl font-bold">Fresh food delivered fast</h2>
              <p className="mt-2 text-sm md:text-base">Discover popular dishes and local favourites — ordered to your door.</p>
              <a href="#top-dishes" className="inline-block mt-4 px-4 py-2 bg-orange-500 text-white rounded">See top dishes</a>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-6">
        <div className="flex gap-6 items-center justify-center flex-wrap py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {categories.map((c, idx) => (
            <div key={idx} className="flex-shrink-0">
              <CategoryPill
                category={c}
                active={activeCategory === c.name}
                onClick={(name) => setActiveCategory(name)}
                layout="vertical"
                imageClass="w-20 h-20"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-100 my-8" />

      <section id="top-dishes" className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Top dishes near you</h2>
        <TopDishes dishes={topDishes} onAdd={handleAdd} />
      </section>

      <section className="mt-12">
  <h2 className="text-xl font-semibold mb-4">All dishes{activeCategory!=='All' ? ` — ${activeCategory}` : ''}</h2>
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No dishes found for this category.</div>
          ) : (
            <DishGrid dishes={filtered} onAdd={handleAdd} />
          )}
      </section>
    </div>
  );
}
