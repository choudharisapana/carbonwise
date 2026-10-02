// frontend/src/utils/apiConfig.js

const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Strip any trailing slash(es) first.
const trimmed = raw.replace(/\/+$/, '');


export const API_URL = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;

export const BACKEND_URL = API_URL.replace(/\/api$/, '');
