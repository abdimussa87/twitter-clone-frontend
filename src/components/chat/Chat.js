import { Grid, Hidden } from "@material-ui/core";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SendIcon from "@material-ui/icons/Send";
import { getChatAsync } from "../../features/message/messageSlice";
import Sidebar from "../Sidebar/Sidebar";
import "./Chat.css";
import jwt_decode from "jwt-decode";


function Chat(props) {
  const id = props.match.params.id;
  let userId = useRef(getUserId());

  const dispatch = useDispatch();
  const chat = useSelector((state) => state.message.chat);
  const maxImagesToShow = 3;
  let remainingUsers = chat?.users?.length - maxImagesToShow ?? 0;
  remainingUsers -= 1; // removing our own image
  console.log(remainingUsers);

  useEffect(() => {
    dispatch(getChatAsync({ id }));
  }, [dispatch, id]);

  const createChatParticipantsImages = (user) => {
    return (
      <img
        key={user._id}
        alt="chat users"
        src={`http://localhost:8080/${user.profilePic}`}
      />
    );
  };
  return (
    <Grid container>
      <Grid item xs={2} sm={2} md={2} lg={2}>
        <Sidebar active="messages" />
      </Grid>

      <Grid className="chat" item sm={10} md={7} lg={6} xs={10}>
        <div className="chat__header">
          <h4>Chat</h4>
        </div>
        <div className="chat__titleContainer">
          <span className="chat__titleImagesContainer">
            {remainingUsers && remainingUsers > 0 ? (
              <span className="chat__remainingUsers">
                {`+${remainingUsers}`}
              </span>
            ) : (
              ""
            )}
            {chat?.users?.slice(0,maxImagesToShow+1).map((user) => {
              if(user._id !==userId.current)
              return createChatParticipantsImages(user);
              return null
            })}
          </span>
          <span id="chat__name">This is the chat</span>
        </div>
        <div className="chat__body">
          <h5>hi</h5>
        </div>
        <div className="chat__bottom">
          <textarea placeholder="Type a message..."></textarea>
          <SendIcon className="chat__sendButton" />
        </div>
      </Grid>

      <Hidden smDown>
        <Grid className="home__right" item md={3} lg={4}>
          hi
        </Grid>
      </Hidden>
    </Grid>
  );
}
function getUserId() {
  const token = localStorage.getItem("token");
  let decoded = jwt_decode(token);
  return decoded._id;
}

export default Chat;
