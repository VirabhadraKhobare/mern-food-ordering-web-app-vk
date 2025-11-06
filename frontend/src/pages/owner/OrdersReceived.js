import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../../config';
export default function OrdersReceived(){
  const [orders,setOrders]=useState([]);
  useEffect(()=>{ const t=localStorage.getItem('token'); if(!t) return; axios.get(API_BASE + '/orders/received', { headers:{ Authorization:'Bearer '+t }}).then(r=> setOrders(r.data)).catch(()=>{}); },[]);
  const updateStatus = async (id, status)=>{ const t=localStorage.getItem('token'); await axios.put(API_BASE + '/orders/' + id + '/status', { status }, { headers:{ Authorization:'Bearer '+t }}); setOrders(orders.map(o=> o._id===id? {...o, status}: o)); };
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Orders Received</h2>
      {orders.length===0 && <div className="text-gray-500">No orders</div>}
      <div className="space-y-3">
        {orders.map(o=> (
          <div key={o._id} className="bg-white p-3 rounded shadow">
            <div className="flex justify-between">
              <div><strong>Order:</strong> {o._id}</div>
              <div className="text-sm text-gray-600">{o.status}</div>
            </div>
            <div className="mt-2 text-sm">Customer: {o.customerId}</div>
            <div className="mt-1">Total: ₹{o.totalAmount?.toFixed(2)}</div>
            <div className="mt-3 space-x-2">
              <button onClick={()=>updateStatus(o._id,'preparing')} className="px-2 py-1 border rounded">Preparing</button>
              <button onClick={()=>updateStatus(o._id,'dispatching')} className="px-2 py-1 border rounded">Dispatching</button>
              <button onClick={()=>updateStatus(o._id,'delivered')} className="px-2 py-1 bg-green-600 text-white rounded">Delivered</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
