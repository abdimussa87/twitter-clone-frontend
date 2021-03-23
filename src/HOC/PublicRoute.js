import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PublicRoute(props) {
    const auth = useSelector(state => state.auth)

    if (auth.authenticated) {
        return <Redirect to='/' />
    }
    return <Route path={props.path} component={props.child} />
}

export default PublicRoute
