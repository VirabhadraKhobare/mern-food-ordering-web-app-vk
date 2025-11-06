import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE } from '../config';
import '../styles/checkout.css';

export default function Contact(){
  const cart = useSelector(s=> s.cart.items);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const deliveryFee = 2;

  useEffect(()=>{
    let mounted = true;
    async function load(){
      setLoading(true);
      try{
        const arr = await Promise.all(cart.map(ci => axios.get(`${API_BASE}/dishes/${ci.dishId}`).then(r=> ({ ...r.data, quantity: ci.quantity })) ));
        if(mounted) setItems(arr);
      }catch(e){ console.error(e); if(mounted) setItems([]); }
      if(mounted) setLoading(false);
    }
    if(cart.length) load(); else { setItems([]); setLoading(false); }
    return ()=> mounted = false;
  },[cart]);

  // prices are stored as whole rupees — compute subtotal in rupees
  const subtotal = items.reduce((s,i)=> s + (i.price || 0) * (i.quantity || 0), 0);
  const total = subtotal + deliveryFee;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Contact</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <form className="delivery-form bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="First Name" />
              <input placeholder="Last Name" />
              <input className="col-span-2" placeholder="Email address" />
              <input className="col-span-2" placeholder="Street" />
              <input placeholder="City" />
              <input placeholder="State" />
              <input placeholder="Zip code" />
              <input placeholder="Country" />
              <input className="col-span-2" placeholder="Phone" />
            </div>
          </form>
        </div>
        <aside className="col-span-1">
          <div className="p-6 bg-white rounded shadow">
            <h3 className="font-semibold text-lg mb-4">Cart Total</h3>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                <div className="mb-3 flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="mb-3 flex justify-between text-sm text-gray-600"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
                <div className="mb-4 border-t pt-3 flex justify-between font-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                <button className="btn-checkout w-full mt-3">PROCEED TO PAYMENT</button>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
