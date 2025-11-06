import React, {useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { useDispatch } from 'react-redux';
import { setToken, fetchProfile } from '../store/slices/authSlice';

export default function SignupModal({onClose, onSwitchToLogin}){
  const dispatch = useDispatch();
  const [firstName,setFirstName] = useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [agree,setAgree] = useState(false);
  const [msg,setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try{
      const r = await axios.post(API_BASE + '/auth/register', { firstName, email, password });
      dispatch(setToken(r.data.token));
      await dispatch(fetchProfile());
      setMsg('Account created');
      setTimeout(()=> onClose && onClose(), 600);
    }catch(e){
      setMsg(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-sm p-6">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✕</button>
        <h3 className="text-lg font-semibold mb-4">Sign Up</h3>
        <form onSubmit={submit}>
          <input className="w-full border rounded px-3 py-2 mb-3" placeholder="Your name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
          <input className="w-full border rounded px-3 py-2 mb-3" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded px-3 py-2 mb-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="flex items-center mb-3">
            <input id="agree2" type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} className="mr-2" />
            <label htmlFor="agree2" className="text-sm text-gray-600">By continuing, I agree to the terms of use & privacy policy</label>
          </div>
          <button disabled={!agree} className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-60">Create account</button>
        </form>
        {msg && <div className="mt-3 text-sm text-green-600">{msg}</div>}
        <div className="mt-4 text-center text-sm text-gray-600">Already have an account? <button onClick={()=>{ onClose && onClose(); onSwitchToLogin && onSwitchToLogin(); }} className="text-orange-500">Login here</button></div>
      </div>
    </div>
  );
}
