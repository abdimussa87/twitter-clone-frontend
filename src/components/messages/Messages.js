import { Grid, Hidden, IconButton } from "@material-ui/core";
import React, { useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import AddCommentOutlinedIcon from "@material-ui/icons/AddCommentOutlined";
import "./Messages.css";
import { Link } from "react-router-dom";
import { getChatsAsync } from "../../features/message/messageSlice";
import { useDispatch, useSelector } from "react-redux";

function Messages() {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.message.messages);
  const auth = useSelector((state) => state.auth);

  const getOtherChatUsers = (users) => {
    return users.filter((user) => user._id !== auth.user._id);
  };
  const getChatName = (chat) => {
    if (chat.chatName) return chat.chatName;
    let otherChatUsers = getOtherChatUsers(chat.users);
    let namesArray = otherChatUsers.map(
      (user) => user.firstName + " " + user.lastName
    );

    return namesArray.join(", ");
  };
  const getChatImage = (chat) => {
    let otherChatUsers = getOtherChatUsers(chat.users);
    return otherChatUsers[0];
  };
  const getLatestMessage = (chat) => {
    if (chat.latestMessage) {
      let sender = chat.latestMessage.sender;
      return `${sender.firstName} ${sender.lastName}: ${chat.latestMessage.content}`
    }

    return "New chat";
  };
  useEffect(() => {
    dispatch(getChatsAsync());
  }, [dispatch]);
  return (
    <Grid container>
      <Grid item xs={2} sm={2} md={2} lg={2}>
        <Sidebar active="messages" />
      </Grid>

      <Grid className="messages" item sm={10} md={7} lg={6} xs={10}>
        <div className="messages__header">
          <h4>Inbox</h4>
          <IconButton>
            <Link to="/messages/new">
              <AddCommentOutlinedIcon />
            </Link>
          </IconButton>
        </div>

        <div className="messages__body">
          {chats.map((chat) => (
            <Link key={chat._id} to={`/messages/${chat._id}`}>
              <div className="message_container">
                <div
                  className={
                    getOtherChatUsers(chat.users).length > 1
                      ? " message__imagesContainer messages__groupChatImageContainer"
                      : "message__imagesContainer"
                  }
                >
                  <img
                    alt="User profile"
                    src={`http://localhost:8080/${
                      getChatImage(chat).profilePic
                    }`}
                  />
                  {getOtherChatUsers(chat.users).length > 1 && (
                    <img
                      alt="User profile"
                      src={`http://localhost:8080/${
                        getOtherChatUsers(chat.users)[1].profilePic
                      }`}
                    />
                  )}
                </div>
                <div className="messages__content ellipsis">
                  <h5 className="messages__chatName ellipsis">
                    {getChatName(chat)}
                  </h5>
                  <p className="messages__lastChat ellipsis">
                    <span>{getLatestMessage(chat)}</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {chats.length === 0 && (
            <center className="home__posts__nothingToShow">No chats yet</center>
          )}
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

export default Messages;
