import axios from 'axios';

// Creamos la instancia apuntando a la raíz del API
const API = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// 🔄 INTERCEPTOR MÁGICO: Inyecta el token de localStorage con los backticks correctos
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 🎯 Funciones con los mismos nombres de parámetros de tu código viejo:
export const getComponentes = () => API.get('/componentes');
export const createComponente = (componente) => API.post('/componentes', componente);
export const updateComponente = (id, componente) => API.put(`/componentes/${id}`, componente);
export const deleteComponente = (id) => API.delete(`/componentes/${id}`);