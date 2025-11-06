import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
export default function Profile(){
  const [user,setUser]=useState(null);
  useEffect(()=>{ const t = localStorage.getItem('token'); if(!t) return; axios.get(API_BASE + '/users/profile', { headers: { Authorization: 'Bearer ' + t }}).then(r=> setUser(r.data)).catch(()=>{}); },[]);
  if(!user) return <div style={{padding:20}}>Not logged in</div>;
  return (
    <div style={{padding:20}}>
      <h2>{user.firstName} {user.lastName}</h2>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
      <p>Member Since: {new Date(user.memberSince).toLocaleDateString()}</p>
    </div>
  );
}
