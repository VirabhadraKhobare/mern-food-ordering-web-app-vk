// Default to the same-origin `/api` so CRA dev proxy (or production reverse proxy) works by default.
// If you need a different backend URL, set REACT_APP_API_BASE (e.g. http://localhost:5000/api)
export const API_BASE = process.env.REACT_APP_API_BASE || '/api';
