import axios from 'axios';

// Substitua 000.000.0.0: pelo SEU IP 
const api = axios.create({
    baseURL: 'http://000.000.0.0:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
