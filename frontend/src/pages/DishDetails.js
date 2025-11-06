import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import { useToast } from '../components/ToastProvider';

export default function DishDetails(){
  const { id } = useParams();
  const [dish,setDish] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast ? useToast() : null;
  useEffect(()=>{ axios.get(API_BASE + '/dishes/' + id).then(r=> setDish(r.data)).catch(()=>{}); },[id]);
  const [variant, setVariant] = useState(null);
  // when dish data loads, initialize variant
  React.useEffect(()=>{
    if(dish) setVariant((dish.availableTypes && dish.availableTypes[0]) || dish.type || null);
  },[dish]);
  if(!dish) return <div className="p-6">Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <div className="md:flex md:gap-6">
        <div className="md:w-1/2">
          {dish.imageURL ? <img loading="lazy" src={dish.imageURL} alt={dish.name} className="w-full h-80 object-cover rounded" /> : <div className="h-80 bg-gray-100 rounded flex items-center justify-center">No Image</div>}
        </div>
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold">{dish.name}</h1>
          <p className="text-gray-600 mt-2">{dish.description}</p>
          <div className="mt-4 text-xl font-semibold">₹{dish.price?.toFixed(2)}</div>
          <div className="mt-4">
                  {dish.availableTypes && dish.availableTypes.length > 0 ? (
                    <div className="inline-flex items-center rounded-md overflow-hidden border">
                      {dish.availableTypes.includes('veg') && (
                        <button
                          type="button"
                          onClick={() => setVariant('veg')}
                          aria-pressed={variant === 'veg'}
                          className={`px-3 py-1 text-sm ${variant === 'veg' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
                        >
                          Veg
                        </button>
                      )}
                      {dish.availableTypes.includes('nonveg') && (
                        <button
                          type="button"
                          onClick={() => setVariant('nonveg')}
                          aria-pressed={variant === 'nonveg'}
                          className={`px-3 py-1 text-sm ${variant === 'nonveg' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}
                        >
                          Non-veg
                        </button>
                      )}
                    </div>
                  ) : dish.type ? (
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded ${dish.type==='veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{dish.type==='veg' ? 'Veg' : 'Non-veg'}</div>
                  ) : null}
            <button onClick={()=>{ dispatch(addItem({ dishId: dish._id, quantity: 1, variant })); if(toast && toast.add) toast.add(`${dish.name} added to cart`); }} className="mt-3 ml-3 px-4 py-2 bg-indigo-600 text-white rounded">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
