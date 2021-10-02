import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';
import PrivateRoute from './HOC/PrivateRoute';
import PublicRoute from './HOC/PublicRoute';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Signup from './components/Signup/Signup';
import { isUserLoggedIn } from './features/auth/authSlice';
import Search from './components/Search/Search';
import PostDetail from './components/Post/PostDetail';
import Profile from './components/Profile/Profile';
import Messages from './components/messages/Messages';
import NewMessage from './components/newMessage/NewMessage';
import Chat from './components/chat/Chat';
import { WebSocketContext }  from './features/socket/webSocket';

function App() {

  const dispatch = useDispatch();
  const ws = useContext(WebSocketContext);
  const auth = useSelector(state => state.auth)
  useEffect(() => {

    if (!auth.authenticated) {
      dispatch(isUserLoggedIn());
    }else{
     ws.setupSocket(auth.user);
    }

  }, [dispatch, auth,ws])

  return (
    <div className="app">
      <Router>

        <Switch>
          <PublicRoute path='/signin' child={Login} />

          <PublicRoute path='/signup' child={Signup} />

          <PrivateRoute path='/search' child={Search} />
          <PrivateRoute path='/post/:id' child={PostDetail} />
          {/* <PrivateRoute path='/profile/:id' child={Profile} /> */}
          <PrivateRoute path='/profile/:username' child={Profile} />
          <PrivateRoute path='/messages/new' child={NewMessage} />
          <PrivateRoute path='/messages/:id' child={Chat} />
          <PrivateRoute path='/messages' child={Messages} />

          <PrivateRoute path='/' child={Home} />

        </Switch>
      </Router>
    </div>
  );
}

export default App;
