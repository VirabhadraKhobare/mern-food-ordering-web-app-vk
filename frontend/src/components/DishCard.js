import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function DishCard({ dish, onAdd }) {
  const [variant, setVariant] = useState(
    (dish.availableTypes && dish.availableTypes[0]) || dish.type || null
  );
  const price =
    typeof dish.price === "number" ? dish.price.toFixed(2) : dish.price;
  // Trim image URL (some seed data contains leading whitespace) and provide a safe fallback
  const imgSrc = (dish.imageURL || "").toString().trim();
  const placeholder =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-family="Arial, Helvetica, sans-serif" font-size="24">Image unavailable</text></svg>';
  const renderStars = (rating = 4.5) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    const stars = [];
    for (let i = 0; i < full; i++)
      stars.push(
        <span key={"f" + i} className="text-yellow-500">
          ★
        </span>
      );
    if (half)
      stars.push(
        <span key={"h"} className="text-yellow-500">
          ☆
        </span>
      );
    for (let i = 0; i < empty; i++)
      stars.push(
        <span key={"e" + i} className="text-gray-300">
          ★
        </span>
      );
    return <span className="ml-1">{stars}</span>;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
      <Link
        to={"/dish/" + dish._id}
        className="block h-48 bg-gray-100 overflow-hidden relative dish-image-wrap rounded-t-xl"
      >
        {imgSrc ? (
          <img
            loading="lazy"
            src={imgSrc}
            alt={dish.name}
            className="object-cover w-full h-full dish-image"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = placeholder;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold text-gray-800 text-lg">
              {dish.name}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {(dish.description || "").slice(0, 90)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-red-500 font-bold text-lg">₹{price}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center text-sm text-gray-600 justify-between">
          <div className="flex items-center">
            {renderStars(dish.rating || 4.5)}
          </div>
          <div className="ml-3 text-xs text-gray-400">
            ({dish.reviewsCount || Math.floor(Math.random() * 90 + 10)})
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onAdd && onAdd(dish, variant)}
              className="px-3 py-1.5 bg-orange-500 text-white rounded"
            >
              Add
            </button>
            <Link to={"/dish/" + dish._id} className="text-sm text-gray-500">
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
