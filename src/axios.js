import axios from 'axios'
const token = localStorage.getItem('token');

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        Authorization: token && `Bearer ${token}`
    }
})

instance.interceptors.request.use(req => {
    const newToken = localStorage.getItem('token');
    if (newToken) {
        req.headers.Authorization = `Bearer ${newToken}`
    }
    return req;
})

export default instance;