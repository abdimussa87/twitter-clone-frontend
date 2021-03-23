import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PrivateRoute(props) {
    const { path } = props;
    const auth = useSelector(state => state.auth);
    if (auth.authenticated) {
        return <Route path={path} component={props.child} />
    }
    return <Redirect to='/signin' />
}

export default PrivateRoute
