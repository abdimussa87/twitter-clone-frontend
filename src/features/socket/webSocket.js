import React, { createContext } from 'react'
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import {
 displayTypingIndicator,hideTypingIndicator
} from "../../features/message/messageSlice";
const WebSocketContext = createContext(null)

export { WebSocketContext }

export default function WebSocketProvider({ children })  {
    let socket;
    let ws;

    const dispatch = useDispatch();

    const setupSocket = (userLoggedIn) => {
        socket.emit("setup", userLoggedIn);
    }
    const joinRoom = (chatId) => {
      socket.emit("joinRoom", chatId);
  }
  const typing = (chatId)=>socket.emit('typing',chatId);
  const stopTyping = (chatId)=>socket.emit('stopTyping',chatId);

    if (!socket) {
        socket = io.connect('http://localhost:8080')

        socket.on("typing", (msg) => {
            dispatch(displayTypingIndicator())
        });
        socket.on("stopTyping", (msg) => {
          dispatch(hideTypingIndicator())
      })


        ws = {
            socket: socket,
            setupSocket,
            joinRoom,
            typing,
            stopTyping
        }
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}