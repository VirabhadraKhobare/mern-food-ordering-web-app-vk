import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE } from '../config';
import '../styles/payment.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/slices/cartSlice';
import { useToast } from '../components/ToastProvider';

const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function CheckoutForm({ items, detailedItems }){
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast ? useToast() : null;

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(!stripe || !elements) return;
    setLoading(true);
    try{
  // create payment intent on server
  const resp = await axios.post(`${API_BASE}/payments/create-payment-intent`, { items });
      const clientSecret = resp.data.clientSecret;
      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card, billing_details: { name: 'Customer' } }
      });
      if(result.error){
        setError(result.error.message);
      } else if(result.paymentIntent && result.paymentIntent.status === 'succeeded'){
        // success: create orders (group by restaurant) then clear cart
        try{
          const token = localStorage.getItem('token');
          // group detailedItems by restaurantId
          const groups = {};
          (detailedItems || []).forEach(d=>{
            const rid = d.restaurantId || d.restaurant || 'unknown';
            groups[rid] = groups[rid] || [];
            groups[rid].push({ dishId: d._id, quantity: d.quantity, price: d.price, variant: d.variant });
          });
          const headers = token ? { headers: { Authorization: 'Bearer ' + token } } : {};
          for(const rid of Object.keys(groups)){
            try{
              await axios.post(`${API_BASE}/orders`, { items: groups[rid], restaurantId: rid }, headers);
            }catch(e){ console.warn('Order create failed for restaurant', rid, e?.response?.data || e.message); }
          }
          dispatch(clearCart());
          if(toast && toast.add) toast.add('Payment successful — order placed');
        }catch(e){ console.error('order create error', e); }
        navigate('/');
      }
    }catch(err){
      console.error(err);
      setError(err?.response?.data?.message || err.message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Pay with card</h2>
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <div className="mb-3">
        <label className="block text-sm text-gray-700">Email</label>
        <input placeholder="you@example.com" />
      </div>
      <div className="mb-3">
        <label className="block text-sm text-gray-700">Card information</label>
        <div className="card-element"><CardElement /></div>
      </div>
      <div className="mb-3">
        <label className="block text-sm text-gray-700">Cardholder name</label>
        <input placeholder="Full name on card" />
      </div>
      <div className="mb-3">
        <label className="block text-sm text-gray-700">Country or region</label>
        <select className="w-full p-2 border rounded"><option>Sri Lanka</option><option>United States</option></select>
      </div>
      <div className="mt-6">
        <button type="submit" className="btn-pay" disabled={!stripe || loading}>{loading? 'Processing...' : 'Pay'}</button>
      </div>
    </form>
  );
}

export default function Payment(){
  const cart = useSelector(s=> s.cart.items);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // items[].price is stored as whole rupees — compute subtotal in rupees for display
  const subtotal = items.reduce((s,i)=> s + (i.price || 0) * (i.quantity || 0), 0);
  const deliveryFee = 2;
  const total = subtotal + deliveryFee;

  // If stripe not configured, show fallback message
  if(!stripePromise){
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold mb-6">Payment</h1>
        <div className="text-red-600">Stripe publishable key not configured. Set REACT_APP_STRIPE_PUBLISHABLE_KEY in your environment to enable payments, otherwise the test/simulated flow can be used.</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Payment</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <Elements stripe={stripePromise}>
            <CheckoutForm items={cart} detailedItems={items} />
          </Elements>
        </div>

        <aside className="col-span-1">
          <div className="p-6 bg-white rounded shadow">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            {loading ? <div>Loading...</div> : (
              <div>
                {/* we don't have detailed names here because items is simple; fetch if needed */}
                <div className="mt-4 border-t pt-3">
                  <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-gray-600"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold mt-2"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
