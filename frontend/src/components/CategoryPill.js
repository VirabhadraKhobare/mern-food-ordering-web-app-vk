import React from 'react';

// CategoryPill: renders a circular category image and label.
// Props:
// - category: { name, image, count }
// - active: boolean
// - onClick: function(name)
// - layout: 'horizontal' | 'vertical' (default: 'horizontal')
// - imageClass: Tailwind classes for image size (default 'w-8 h-8')
export default function CategoryPill({ category, active, onClick, layout = 'horizontal', imageClass = 'w-8 h-8' }){
  const baseBtn = layout === 'vertical' ? 'flex flex-col items-center gap-2 px-2 py-1 rounded-md' : 'px-4 py-2 rounded-full flex items-center gap-3';
  const activeClass = active ? 'bg-orange-100 border-orange-300' : 'bg-white border-gray-200';

  return (
    <button
      onClick={() => onClick && onClick(category.name)}
      className={`${baseBtn} border ${activeClass}`}
      aria-pressed={active}
      aria-label={`Filter by ${category.name}`}
    >
      <div className={`${imageClass} rounded-full overflow-hidden bg-white border flex items-center justify-center`}>
        {category.image ? (
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">{category.name?.[0]}</div>
        )}
      </div>

      {layout === 'horizontal' ? (
        <div className="text-left">
          <div className="text-sm font-medium">{category.name}</div>
          <div className="text-xs text-gray-500">{category.count}</div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-sm font-medium">{category.name}</div>
          <div className="text-xs text-gray-500">{category.count}</div>
        </div>
      )}
    </button>
  );
}
