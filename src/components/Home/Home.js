import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import './Home.css'
function Home() {
    const dispatch = useDispatch()
    const signout = (e) => {
        e.preventDefault()
        dispatch(logout())
    }
    return (
        <div className='home'>
            <h5>This is the homepage</h5>
            <button onClick={(e) => signout(e)}>Logout</button>
        </div>
    )
}

export default Home
