import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Hidden,
} from "@material-ui/core";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SendIcon from "@material-ui/icons/Send";
import {
  createMessageAsync,
  getChatAsync,
  updateChatAsync,
} from "../../features/message/messageSlice";
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

  const [openChangeChatNameDialog, setOpenChangeChatNameDialog] =
    useState(false);
  const [chatName, setChatName] = useState(chat?.chatName ?? "");
  const [message, setMessage] = useState("");
  console.log("ui building");
  console.log(chat?.chatName);
  console.log(chatName);
  useEffect(() => {
    dispatch(getChatAsync({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    setChatName(chat?.chatName ?? "");
  }, [chat?.chatName]);

  const createChatParticipantsImages = (user) => {
    return (
      <img
        key={user._id}
        alt="chat users"
        src={`http://localhost:8080/${user.profilePic}`}
      />
    );
  };

  const getOtherChatUsers = (users) => {
    return users.filter((user) => user._id !== userId.current);
  };
  const getChatName = (chat) => {
    if (chat.chatName) return chat.chatName;
    let otherChatUsers = getOtherChatUsers(chat.users);
    let namesArray = otherChatUsers.map(
      (user) => user.firstName + " " + user.lastName
    );

    return namesArray.join(", ");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      console.log("working");
      dispatch(createMessageAsync({content:message,chatId:chat._id}))
      setMessage('');
    }
  };

  const handleOnKeyDown = (e) => {
    if(e.which===13 &&!e.shiftKey){
      handleSendMessage(e);
    }
  };

  const handleOpenChangeChatNameDialogClickOpen = () => {
    setOpenChangeChatNameDialog(true);
  };
  const handleCloseChangeChatNameDialogClickOpen = () => {
    setOpenChangeChatNameDialog(false);
  };

  const handleEditChatNameClick = () => {
    dispatch(updateChatAsync({ id, chatName: chatName.trim() }));
    setOpenChangeChatNameDialog(false);
  };
  const renderChangeChatNameDialog = () => {
    return (
      <Dialog
        open={openChangeChatNameDialog}
        onClose={handleCloseChangeChatNameDialogClickOpen}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Edit chat name</DialogTitle>
        <DialogContent className="editChat">
          <div className="editChat__body">
            <input
              autoFocus
              type="text"
              placeholder="Enter a chat name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseChangeChatNameDialogClickOpen}
            variant="text"
          >
            Cancel
          </Button>
          <Button
            className="deletePost__button"
            onClick={handleEditChatNameClick}
            variant="contained"
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
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
            {chat?.users?.slice(0, maxImagesToShow + 1).map((user) => {
              if (user._id !== userId.current)
                return createChatParticipantsImages(user);
              return null;
            })}
          </span>
          <span
            onClick={handleOpenChangeChatNameDialogClickOpen}
            id="chat__name"
          >
            {chat && getChatName(chat)}
          </span>
        </div>
        <div className="chat__body">
          <h5>hi</h5>
        </div>
        <div className="chat__bottom">
          <textarea
            placeholder="Type a message..."
            onKeyDown={handleOnKeyDown}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <SendIcon onClick={handleSendMessage} className="chat__sendButton" />
        </div>
        {renderChangeChatNameDialog()}
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
