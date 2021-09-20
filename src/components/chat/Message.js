import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./Message.css";
function Message({ message }) {
    const auth = useSelector(state => state.auth);
    const isMine =message?.sender._id===auth.user._id;
  return (
    <div className="message">
      <div className={`message__container  ${isMine? 'mine':''}`}>
        <p>{message.content}</p>
      </div>
    </div>
  );
}

export default Message;
