import React from 'react'
import './Sidebar.css'
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import TwitterIcon from '@material-ui/icons/Twitter';
import { useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { Link } from 'react-router-dom';
function Sidebar({ active }) {
    const dispatch = useDispatch()
    const signout = (e) => {
        e.preventDefault()
        dispatch(logout())
    }
    return (
        <div className='sidebar'>
            <Link to="/" className='sidebar__bird' > <TwitterIcon /></Link>
            <Link to="/"> <HomeIcon className={active === 'home' ? 'active' : ''} /></Link>
            <Link to="/search">< SearchIcon className={active === 'search' ? 'active' : ''} /></Link>
            <Link to="/notifications"> <NotificationsIcon /></Link>
            <Link to="/messages"><EmailIcon /></Link>
            <Link to="/profile"><AccountCircleIcon /></Link>
            <Link to="/signin" onClick={(e) => signout(e)}><ExitToAppIcon /></Link>
        </div>
    )
}

export default Sidebar
