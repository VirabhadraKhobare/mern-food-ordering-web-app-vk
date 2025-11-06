import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function useToast(){
  return useContext(ToastContext);
}

export default function ToastProvider({ children }){
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, opts={ duration: 3000 })=>{
    const id = Date.now() + Math.random();
    const t = { id, message };
    setToasts(s => [...s, t]);
    if(opts.duration !== Infinity){
      setTimeout(()=> setToasts(s => s.filter(x=> x.id !== id)), opts.duration);
    }
    return id;
  },[]);

  const remove = useCallback((id)=> setToasts(s => s.filter(x=> x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 84, zIndex: 60 }}>
        {toasts.map(t=> (
          <div key={t.id} style={{ marginTop: 8 }}>
            <div style={{ background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px 14px', borderRadius: 8, boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
