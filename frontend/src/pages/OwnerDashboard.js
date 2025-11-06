import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import MyDishes from './owner/MyDishes';
import NewDish from './owner/NewDish';
import OrdersReceived from './owner/OrdersReceived';
import Earnings from './owner/Earnings';

export default function OwnerDashboard(){
  return (
    <div className="max-w-6xl mx-auto p-6 md:flex gap-6">
      <aside className="md:w-64 bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-4">Owner Panel</h3>
        <ul className="space-y-2">
          <li><Link to="my-dishes" className="text-indigo-600">My Dishes</Link></li>
          <li><Link to="add-dish" className="text-gray-700">Add New Dish</Link></li>
          <li><Link to="orders" className="text-gray-700">Orders Received</Link></li>
          <li><Link to="earnings" className="text-gray-700">Earnings</Link></li>
        </ul>
      </aside>
      <main className="flex-1">
        <Routes>
          <Route path="my-dishes" element={<MyDishes/>} />
          <Route path="add-dish" element={<NewDish/>} />
          <Route path="orders" element={<OrdersReceived/>} />
          <Route path="earnings" element={<Earnings/>} />
        </Routes>
      </main>
    </div>
  );
}
