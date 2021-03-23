import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signupAsync } from '../../features/auth/authSlice';
import './Signup.css'

function Signup(props) {
    const [firstName, setfirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const signup = (e) => {
        e.preventDefault();
        if (firstName.trim() && lastName.trim() && username.trim() && email.trim() && password.length >= 6 && confirmPassword.length >= 6) {
            if (password === confirmPassword) {
                dispatch(signupAsync({ firstName, lastName, email, username, password }))
            } else {
                alert('Passwords don\'t match')
            }
        } else {
            alert('Please provide input to all fields.')
        }
    }
    return (
        <div className='signup'>
            <div className="signup__container">
                <h5 className='signup__title'> Register</h5>
                {auth.error?.message && <p style={{ color: 'red', marginBottom: '5px' }}>{auth.error.message}</p>}
                <form >
                    <input type="text" value={firstName} onChange={(e) => setfirstName(e.target.value)} placeholder='First Name' required />
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='Last Name' required />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' required />
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm password' required />
                    <Button type='submit' onClick={(e) => signup(e)}>Signup</Button>
                </form>
                <p onClick={() => props.history.push('/login')}>Already have an account? Login here</p>
            </div>
        </div>
    )
}

export default Signup
