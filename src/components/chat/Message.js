import React from "react";
import { useSelector } from "react-redux";
import "./Message.css";
function Message({ message, nextMessage, lastSenderId }) {
  const auth = useSelector((state) => state.auth);
  const isMine = message?.sender._id === auth.user._id;
  const currentSenderId = message.sender._id;
  const nextSenderId = nextMessage != null ? nextMessage.sender._id : "";
  const isFirstMessage = lastSenderId !== currentSenderId;
  const isLastMessage = nextSenderId !== message.sender._id;
  return (
    <div className="message">
      {!isMine && isFirstMessage && (
        <span className="message__senderName">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
      )}
      <div className="message__outerContainer">
      {!isMine && isLastMessage && <img alt='user profile' className='message__senderImage' src={`http://localhost:8080/${message.sender.profilePic}`} />}
        <div
          className={`message__container  ${isMine ? "mine" : "their"} ${
            isFirstMessage ? "first" : ""
          } ${isLastMessage ? "last" : ""}`}
        >
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  );
}

export default Message;
