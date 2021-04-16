// import store from './app/store'
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

//! do this when you figure out how to get the store then dispatch a logout
//! action
// instance.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response.status === 500 && error.response.data.message.name === 'TokenExpiredError') {

//             console.log('in error')
//         }
//     }
// )

export default instance;