import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginAsync } from '../../features/auth/authSlice';

import './Login.css'
function Login(props) {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const login = (e) => {
        e.preventDefault();
        if (usernameOrEmail.trim() && password.length >= 6) {
            dispatch(loginAsync({ usernameOrEmail, password }))
        } else {
            alert('Please input the required fields.')
        }
    }
    return (
        <div className='login'>
            <div className="login__container">
                <h5 className='login__title'> Login</h5>
                {auth.error?.message && <p style={{ color: 'red', marginBottom: '5px' }}>{auth.error.message}</p>}
                <form >
                    <input type="text" value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} placeholder='Username or email' required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required />
                    <Button type='submit' onClick={(e) => login(e)}>Login</Button>
                </form>
                <p onClick={() => props.history.push('/signup')}>Need an account? Register here</p>
            </div>

        </div>
    )
}

export default Login
