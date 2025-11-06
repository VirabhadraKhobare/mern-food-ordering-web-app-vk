import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../../config';
export default function Earnings(){
  const [earn,setEarn]=useState(0);
  useEffect(()=>{ const t=localStorage.getItem('token'); if(!t) return; axios.get(API_BASE + '/owner/earnings', { headers:{ Authorization:'Bearer '+t }}).then(r=> setEarn(r.data.totalEarnings || 0)).catch(()=>{}); },[]);
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">Grand Total Earnings</h2>
      <h3 className="text-2xl mt-3">₹{earn.toFixed(2)}</h3>
    </div>
  );
}
