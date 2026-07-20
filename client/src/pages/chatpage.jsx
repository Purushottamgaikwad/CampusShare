import { useEffect, useState,useRef, use } from "react";
import {useChat} from "../context/chatcontext.jsx";
import ChatList from "./chatList.jsx";
import  ChatWindow from "./chatWindow.jsx";

  
function ChatPage({ currentUser }) {  // ✅ receive currentUser
  const { activeChatUser, goBackToList } = useChat();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {activeChatUser === null
        ? <ChatList  />
        : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

            <ChatWindow currentUser={currentUser} />  {/* ✅ pass currentUser not activeChatUser */}
          </div>
        )
      }
    </div>
  );
}



export default ChatPage;