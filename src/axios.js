// import store from './app/store'
import axios from 'axios'
import { logout } from './features/auth/authSlice'

const token = localStorage.getItem('token');
let store

export const injectStore = _store => {
  store = _store
}
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


instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401 && error.response.data.message.name === 'TokenExpiredError') {
            store.dispatch(logout())
            console.log('in error')
        }
        return Promise.reject(error);
    }
)

export default instance;