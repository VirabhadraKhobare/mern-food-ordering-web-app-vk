import React, {useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { useDispatch } from 'react-redux';
import { setToken, fetchProfile } from '../store/slices/authSlice';

export default function LoginModal({onClose, onSwitchToSignup}){
  const dispatch = useDispatch();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [msg,setMsg]=useState('');
  const [agree,setAgree] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try{
      const r = await axios.post(API_BASE + '/auth/login',{ email,password });
      dispatch(setToken(r.data.token));
      await dispatch(fetchProfile());
      setMsg('Logged in');
      setTimeout(()=> onClose && onClose(), 600);
    }catch(e){
      setMsg(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-sm p-6">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✕</button>
        <h3 className="text-lg font-semibold mb-4">Login</h3>
        <form onSubmit={submit}>
          <input className="w-full border rounded px-3 py-2 mb-3" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded px-3 py-2 mb-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="flex items-center mb-3">
            <input id="agree" type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} className="mr-2" />
            <label htmlFor="agree" className="text-sm text-gray-600">By continuing, I agree to the terms of use & privacy policy</label>
          </div>
          <button disabled={!agree} className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-60">Login</button>
        </form>
        {msg && <div className="mt-3 text-sm text-red-600">{msg}</div>}
        <div className="mt-4 text-center text-sm text-gray-600">Create a new account? <button onClick={()=>{ onClose && onClose(); if(onSwitchToSignup) onSwitchToSignup(); }} className="text-orange-500">Click here</button></div>
      </div>
    </div>
  );
}
