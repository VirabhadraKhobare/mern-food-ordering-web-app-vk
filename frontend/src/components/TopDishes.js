import React from 'react';
import DishCard from './DishCard';
import FetchStatus from './FetchStatus';

export default function TopDishes({ dishes = [], onAdd, loading = false, error = null, onRetry }){
  if(loading){
    // show polished skeletons when loading
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="dish-card skeleton" aria-hidden="true">
            <div className="skeleton-thumb" />
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if(error){
    return <FetchStatus error={error} onRetry={onRetry} />;
  }

  if(!dishes || dishes.length === 0){
    return <FetchStatus emptyTitle="No top dishes yet" emptyMessage="Popular items will appear here once the backend returns data." onRetry={onRetry} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {dishes.map(d => (
        <DishCard key={d._id} dish={d} onAdd={onAdd} />
      ))}
    </div>
  );
}
