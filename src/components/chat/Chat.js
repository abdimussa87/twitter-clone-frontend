import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Hidden,
} from "@material-ui/core";
import React, { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SendIcon from "@material-ui/icons/Send";
import { Scrollbars } from "react-custom-scrollbars";
import {
  createMessageAsync,
  getChatAsync,
  getChatMessagesAsync,
  updateChatAsync,
} from "../../features/message/messageSlice";
import Sidebar from "../Sidebar/Sidebar";
import "./Chat.css";
import jwt_decode from "jwt-decode";
import Message from "./Message";
import { WebSocketContext } from "../../features/socket/webSocket";

function Chat(props) {
  const id = props.match.params.id;
  const ws = useContext(WebSocketContext);
  let userId = useRef(getUserId());
  const dispatch = useDispatch();
  const chat = useSelector((state) => state.message.chat);
  const isLoading = useSelector((state) => state.message.loading);
  const isTyping = useSelector((state) => state.message.isTyping);
  const messages = useSelector((state) => state.message.chats);
  const maxImagesToShow = 3;
  let remainingUsers = chat?.users?.length - maxImagesToShow ?? 0;
  remainingUsers -= 1; // removing our own image
  let currentUserTyping = false;
  const timerRef = useRef(null);

  const [openChangeChatNameDialog, setOpenChangeChatNameDialog] =
    useState(false);
  const [chatName, setChatName] = useState(chat?.chatName ?? "");
  const [message, setMessage] = useState("");
  const scrollBar = useRef(null);

  const scrollToBottom = () => {
    scrollBar.current?.scrollToBottom();
  };
  useEffect(() => {
    dispatch(getChatAsync({ id }));
    dispatch(getChatMessagesAsync({ chatId: id }));
    ws.joinRoom(id);
  }, [dispatch, id, ws]);

  useEffect(() => {
    setChatName(chat?.chatName ?? "");
  }, [chat?.chatName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
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
  const updateTyping = () => {
    clearTimeout(timerRef.current);
    if (!currentUserTyping) {
      ws.typing(id);
      currentUserTyping = true;
    }
    timerRef.current = setTimeout(() => {
      ws.stopTyping(id);
      currentUserTyping = false;
    }, 3000);
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      ws.stopTyping(id);
      currentUserTyping = false;
      dispatch(createMessageAsync({ content: message, chatId: chat._id ,ws}))
      setMessage("");
    }
  };

  const handleOnKeyDown = (e) => {
    if (e.which === 13 && !e.shiftKey) {
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

  console.log('ui building')
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
          {isLoading ? (
            <div className="loadingSpinnerContainer">
              <img
                className="loadingSpinner"
                src="/loadingSpinner.gif"
                alt="loading indicator"
              />
            </div>
          ) : (
            <Scrollbars ref={scrollBar} autoHide={true}>
              {messages &&
                messages.map((message, index) => {
                  if (index !== 0) {
                    return (
                      <Message
                        key={message._id}
                        message={message}
                        lastSenderId={messages[index - 1].sender._id}
                        nextMessage={messages[index + 1]}
                      />
                    );
                  }
                  return (
                    <Message
                      key={message._id}
                      message={message}
                      lastSenderId=""
                      nextMessage={messages[index + 1]}
                    />
                  );
                })}
            </Scrollbars>
          )}
        </div>
        {isTyping && (
          <div className="chat__typingIndicator">
            <img src="/dots.gif" alt="typing indicator" />
          </div>
        )}
        <div className="chat__bottom">
          <textarea
            placeholder="Type a message..."
            onKeyDown={handleOnKeyDown}
            value={message}
            onChange={(e) => {
              updateTyping();
              setMessage(e.target.value);
            }}
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
