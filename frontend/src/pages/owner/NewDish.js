import React, {useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../../config';
export default function NewDish(){
  const [form,setForm]=useState({name:'',description:'',price:0,category:'Burger',image:null,isPopular:false,restaurantName:''});
  const [msg,setMsg]=useState('');
  const submit = async (e)=>{ e.preventDefault(); try{ const t=localStorage.getItem('token'); const fd = new FormData(); fd.append('name', form.name); fd.append('description', form.description); fd.append('price', form.price); fd.append('category', form.category); fd.append('isPopular', form.isPopular); if(form.restaurantName) fd.append('restaurantName', form.restaurantName); if(form.image) fd.append('image', form.image); const r = await axios.post(API_BASE + '/owner/dishes', fd, { headers:{ Authorization:'Bearer '+t, 'Content-Type':'multipart/form-data' }}); setMsg('Dish added'); setForm({...form, name:'',description:'',price:0,image:null}); }catch(e){ setMsg(e.response?.data?.message || 'Error'); } };
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Add New Dish</h2>
      <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
        <input className="w-full p-2 border rounded" placeholder="Dish name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="w-full p-2 border rounded" placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
        <input className="w-full p-2 border rounded" placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form,price:parseFloat(e.target.value||0)})} />
        <input className="w-full p-2 border rounded" placeholder="Restaurant name (optional)" value={form.restaurantName} onChange={e=>setForm({...form,restaurantName:e.target.value})} />
        <input type="file" onChange={e=>setForm({...form,image: e.target.files[0]})} />
        <label className="inline-flex items-center"><input type="checkbox" checked={form.isPopular} onChange={e=>setForm({...form,isPopular:e.target.checked})} className="mr-2"/> Popular</label><br/>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Add Dish</button>
      </form>
      <div className="mt-2 text-green-600">{msg}</div>
    </div>
  );
}
