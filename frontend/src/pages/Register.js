import React, {useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { useDispatch } from 'react-redux';
import { setToken, fetchProfile } from '../store/slices/authSlice';
export default function Register(){
  const [form,setForm]=useState({firstName:'',lastName:'',email:'',password:'',role:'customer'});
  const [msg,setMsg]=useState('');
  const submit= async (e)=>{ e.preventDefault(); try{ const r = await axios.post(API_BASE + '/auth/register', form); dispatch(setToken(r.data.token)); await dispatch(fetchProfile()); setMsg('Registered'); }catch(e){ setMsg(e.response?.data?.message || 'Error'); } };
  return (
    <div style={{padding:20}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input placeholder="First name" value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})} /><br/>
        <input placeholder="Last name" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} /><br/>
        <input placeholder="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /><br/>
        <input placeholder="password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} /><br/>
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="customer">Customer</option>
          <option value="owner">Restaurant Owner</option>
        </select><br/>
        <button>Register</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
