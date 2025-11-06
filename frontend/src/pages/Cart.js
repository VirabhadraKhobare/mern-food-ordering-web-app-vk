import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { API_BASE } from '../config';
import { removeItem, updateQuantity, clearCart } from '../store/slices/cartSlice';
import '../styles/cart.css';
import { useNavigate } from 'react-router-dom';

export default function Cart(){
  const cart = useSelector(s=> s.cart.items);
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState('');
  const deliveryFee = 2; // fixed for now

  useEffect(()=>{
    let mounted = true;
    async function load(){
      setLoading(true);
      try{
  const arr = await Promise.all(cart.map(ci => axios.get(`${API_BASE}/dishes/${ci.dishId}`).then(r=> ({ ...r.data, quantity: ci.quantity, variant: ci.variant })) ));
  if(mounted) setItems(arr);
      }catch(e){ console.error(e); if(mounted) setItems([]); }
      if(mounted) setLoading(false);
    }
    if(cart.length) load(); else { setItems([]); setLoading(false); }
    return ()=> mounted = false;
  },[cart]);

  // backend stores price as whole rupees now — compute subtotal in rupees
  const subtotal = items.reduce((s,i)=> s + (i.price || 0) * (i.quantity || 0), 0);
  const total = subtotal + deliveryFee;

  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/payment');
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Cart</h1>
      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            {items.length === 0 && <div className="text-gray-500">Your cart is empty</div>}
            {items.map(it => (
              <div key={it._id} className="cart-row">
                <div className="cart-row-left">
                  <img src={it.imageURL} alt={it.name} className="w-20 h-20 object-cover rounded" />
                  <div className="ml-4">
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-gray-500">{it.description?.slice(0,60)}</div>
                  </div>
                </div>
                <div className="cart-row-right">
                  <div className="text-sm text-gray-600">₹{(it.price).toFixed(2)}</div>
                  {it.variant && <div className="text-xs text-gray-500 mt-1">{it.variant === 'veg' ? 'Veg' : 'Non-veg'}</div>}
                  <div className="quantity-controls">
                    <button onClick={()=> dispatch(updateQuantity({ dishId: it._id, variant: it.variant, quantity: Math.max(1, it.quantity - 1) })) }>-</button>
                    <input value={it.quantity} onChange={e=> { const q = parseInt(e.target.value||0,10); if(!isNaN(q)) dispatch(updateQuantity({ dishId: it._id, variant: it.variant, quantity: q })); }} />
                    <button onClick={()=> dispatch(updateQuantity({ dishId: it._id, variant: it.variant, quantity: it.quantity + 1 })) }>+</button>
                  </div>
                  <div className="text-sm font-semibold">₹{((it.price * it.quantity)).toFixed(2)}</div>
                  <button className="remove-btn" onClick={()=> dispatch(removeItem({ dishId: it._id, variant: it.variant }))}>x</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="col-span-1">
            <div className="p-6 bg-white rounded shadow">
              <h3 className="font-semibold text-lg mb-4">Cart Total</h3>
              <div className="mb-3 flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="mb-3 flex justify-between text-sm text-gray-600"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
              <div className="mb-4 border-t pt-3 flex justify-between font-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>

              <div className="mb-3">
                <label className="text-sm text-gray-600">If you have a promo code, enter it here</label>
                <div className="mt-2 flex">
                  <input value={promo} onChange={e=> setPromo(e.target.value)} placeholder="Promo Code" className="promo-input" />
                  <button className="btn-apply">Submit</button>
                </div>
              </div>

              <button onClick={handleProceed} className="btn-checkout w-full mt-3">PROCEED TO PAYMENT</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
