import React from 'react';
import DishCard from './DishCard';

export default function DishGrid({ dishes = [], onAdd }){
  if(!dishes || dishes.length === 0) return <div className="text-center text-gray-500 py-8">No dishes to show.</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map(d => (
        <DishCard key={d._id} dish={d} onAdd={onAdd} />
      ))}
    </div>
  );
}
