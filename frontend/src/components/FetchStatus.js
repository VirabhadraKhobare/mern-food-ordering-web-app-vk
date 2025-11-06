import React from 'react';

export default function FetchStatus({ loading = false, error = null, emptyTitle = 'No items', emptyMessage = '', onRetry }){
  if(loading){
    // caller should render skeletons when appropriate; provide a compact loader
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="animate-pulse text-gray-400">Loading…</div>
      </div>
    );
  }

  if(error){
    return (
      <div className="w-full bg-white rounded-lg p-6 shadow-sm border border-red-50 text-center">
        <h3 className="text-md font-semibold text-red-700">Something went wrong</h3>
        <p className="mt-2 text-sm text-red-600">{String(error)}</p>
        {onRetry && (
          <div className="mt-4">
            <button onClick={onRetry} className="newsletter-btn">Retry</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
      <h3 className="text-lg font-semibold text-gray-700">{emptyTitle}</h3>
      {emptyMessage && <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>}
      {onRetry && (
        <div className="mt-4">
          <button onClick={onRetry} className="newsletter-btn">Retry</button>
        </div>
      )}
    </div>
  );
}
