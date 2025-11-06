import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
export default function ProtectedRoute({ children, role }){
  const token = useSelector(s => s.auth.token);
  const user = useSelector(s => s.auth.user);
  if(!token) return <Navigate to='/login' />;
  if(role && user?.role !== role) return <Navigate to='/' />;
  return children;
}
