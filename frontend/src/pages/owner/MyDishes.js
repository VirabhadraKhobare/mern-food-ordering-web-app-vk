import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../../config';
export default function MyDishes(){
  const [dishes,setDishes]=useState([]);
  useEffect(()=>{ const t = localStorage.getItem('token'); if(!t) return; axios.get(API_BASE + '/owner/dishes', { headers:{ Authorization: 'Bearer ' + t }}).then(r=> setDishes(r.data)).catch(()=>{}); },[]);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">My Dishes</h2>
      {dishes.length===0 && <div className="text-gray-500">No dishes yet</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dishes.map(d=> (
          <div key={d._id} className="bg-white rounded shadow p-3 flex">
            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden mr-3 flex items-center justify-center">
              {d.imageURL ? <img src={d.imageURL} alt={d.name} className="object-cover w-full h-full" /> : <div className="text-sm text-gray-400">No Img</div>}
            </div>
            <div>
              <h4 className="font-semibold">{d.name}</h4>
              <div className="text-sm text-gray-600">{d.category} • ₹{d.price?.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
