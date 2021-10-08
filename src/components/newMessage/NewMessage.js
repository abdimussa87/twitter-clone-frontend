import { Avatar, Grid, Hidden } from "@material-ui/core";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { createChatAsync } from "../../features/message/messageSlice";
import {
  searchForUserAsync,
  setUsersToEmtpy,
} from "../../features/user/userSlice";
import Sidebar from "../Sidebar/Sidebar";
import "./NewMessage.css";
function NewMessage() {
  const [nameOfReciever, setNameOfReciever] = useState("");
  //   const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const inputRef = useRef("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth);
  const history =useHistory();

  const handleCreateChatClick = () => {
    dispatch(createChatAsync({ users:selectedUsers })).then(unwrapResult).then(result => {
      history.push(`/messages/${result.data._id}`);
    }).catch(err=>{
      console.log(err)
    });
    setNameOfReciever("");
  };

  const handleOnInputChanged = (e) => {
    clearTimeout(timerRef.current);
    setNameOfReciever(e.target.value);
    timerRef.current = setTimeout(() => {
      if (e.target.value.length === 0) {
        dispatch(setUsersToEmtpy());
        return;
      }
      dispatch(searchForUserAsync({ searchTerm: e.target.value }));
    }, 1000);
  };

  const handleOnUserClicked = (user) => {
    setNameOfReciever("");
    setSelectedUsers([...selectedUsers, user]);
    dispatch(setUsersToEmtpy());
    inputRef.current.focus();
  };
  const handleOnKeyDown = (e) => {
    if (e.key === "Backspace" && nameOfReciever.length === 0) {
      setSelectedUsers(
        selectedUsers.filter((_, i) => i !== selectedUsers.length - 1)
      );
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    dispatch(setUsersToEmtpy());
  }, [dispatch]);


  return (
    <div>
      <Grid container>
        <Grid item xs={2} sm={2} md={2} lg={2}>
          <Sidebar active="messages" />
        </Grid>

        <Grid className="newMessage" item sm={10} md={7} lg={6} xs={10}>
          <div className="newMessage__header">
            <h4>New message</h4>
          </div>
          <div className="newMessage__body">
            <div className="newMessage__bodyTop">
              <label htmlFor="newMessage__textbox">To:</label>
              <div className="newMessage__selectedUsers">
                {selectedUsers.map((user) => (
                  <span key={user._id} className="newMessage__selectedUser">
                    {user.firstName}
                  </span>
                ))}
              </div>
              <input
                id="newMessage__textbox"
                ref={inputRef}
                type="text"
                value={nameOfReciever}
                onChange={handleOnInputChanged}
                onKeyDown={handleOnKeyDown}
                placeholder="Type the name of the person"
              />
            </div>
            {user.users.length > 0 ? (
              <div className="newMessage__searchUsers">
                {user.users.map((user) => {
                  if (
                    user._id !== auth.user._id &&
                    !selectedUsers.some((u) => u._id === user._id)
                  ) {
                    return (
                      <div
                        key={user._id}
                        onClick={() => handleOnUserClicked(user)}
                      >
                        <Avatar
                          src={` https://twitter-clone-abdi.herokuapp.com/${user.profilePic}`}
                        />
                        <Link to={`/profile/${user.username}`}>
                          {`${user.firstName} ${user.lastName} `}
                        </Link>
                        <span className="post__right__username">{`@${user.username} `}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <p></p>
            )}

            <button
              disabled={selectedUsers.length > 0 ? false : true}
              onClick={handleCreateChatClick}
              style={{
                cursor:
                  selectedUsers.length > 0 ? "pointer" : "inherit",
              }}
            >
              Create chat
            </button>
          </div>
        </Grid>

        <Hidden smDown>
          <Grid className="home__right" item md={3} lg={4}>
            hi
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default NewMessage;
