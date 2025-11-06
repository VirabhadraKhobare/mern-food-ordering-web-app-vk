import React, {useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { useDispatch } from 'react-redux';
import { setToken, fetchProfile } from '../store/slices/authSlice';
export default function Login(){
  const [email,setEmail]=useState(''), [password,setPassword]=useState(''), [msg,setMsg]=useState('');
  const submit= async (e)=>{ e.preventDefault(); try{ const r = await axios.post(API_BASE + '/auth/login',{ email,password }); dispatch(setToken(r.data.token)); await dispatch(fetchProfile()); setMsg('Logged in'); }catch(e){ setMsg(e.response?.data?.message || 'Error'); } };
  return (
    <div style={{padding:20}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <button>Login</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
