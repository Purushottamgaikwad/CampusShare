import { useEffect, useState, useRef } from "react";
import { useChat } from "../context/chatcontext.jsx";
import socket from "./socket.js";

function ChatWindow({ currentUser }) {

  const { activeChatUser, goBackToList } = useChat();
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const bottomRef               = useRef(null);

  // ✅ keep activeChatUser in a ref so socket handler always has latest value
  const activeChatUserRef = useRef(activeChatUser);
  const currentUserRef    = useRef(currentUser);

  // update refs whenever values change
  useEffect(() => {
    activeChatUserRef.current = activeChatUser;
  }, [activeChatUser]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // ── Load messages from DB ───────────────────────────
  useEffect(() => {
    if (!activeChatUser?.id) return;
    setMessages([]);
    // console.log('Loading messages for chat with user ID:', activeChatUser.id);

    fetch(`${import.meta.env.VITE_API_URL}/api/messages/${activeChatUser.id}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(err => console.error('messages load error:', err));

  }, [activeChatUser?.id]);

  // ── Listen for live messages ────────────────────────
  useEffect(() => {
    const handleReceive = (msg) => {
      // ✅ use refs — always have latest values
      const activeUser   = activeChatUserRef.current;
      const loggedInUser = currentUserRef.current;

      console.log('🔴 msg received:', msg);
      console.log('🔴 activeUser:', activeUser?.id);
      console.log('🔴 loggedInUser:', loggedInUser?.id);

      const belongsHere =
        (Number(msg.sender_id)   === Number(loggedInUser?.id)  &&
         Number(msg.receiver_id) === Number(activeUser?.id))   ||
        (Number(msg.sender_id)   === Number(activeUser?.id)    &&
         Number(msg.receiver_id) === Number(loggedInUser?.id));

      console.log('🔴 belongsHere:', belongsHere);

      if (belongsHere) {
        console.log('✅ adding message to state');
        setMessages(prev => [...prev, msg]); // ✅ updates instantly
      }
    };

    socket.on('receiveMessage', handleReceive);
    return () => socket.off('receiveMessage', handleReceive);

  }, []); 

  // ── Auto scroll ─────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ────────────────────────────────────
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit('sendMessage', {
      senderId:   currentUser.id,
      receiverId: activeChatUser.id,
      message:    input
    });

    setInput('');
  };

  //-----delete chat -----------------------------

// const deleteChat = async (id) => {
//   console.log(id);
//  fetch(`http://localhost:5000/chat/${id}`, {
//       method:'DELETE',
//       credentials: 'include'
//     })

// };



  return<>

  
      <div style={{
            display:       'flex',
            flexDirection: 'column',
            height:        '100%'
          }}>

      {/* ── Header ── */}
      <div style={{
        display:         'flex',
        alignItems:      'center',
        gap:             '10px',
        padding:         '10px 14px',
        borderBottom:    '1px solid #ececec',
        backgroundColor: '#f9f9f9',
        borderRadius:    '12px 12px 0 0',
        flexShrink:      0
      }}>

        {/* Back button */}
        <button
          onClick={goBackToList}
          style={{
            background:  'none',
            border:      'none',
            fontSize:    '18px',
            cursor:      'pointer',
            color:       '#555',
            padding:     '0 6px'
          }}
        >
          ←
        </button>

        <img
          src={
            activeChatUser.avatar
              ? `http://localhost:5000${activeChatUser.avatar}`
              : 'https://via.placeholder.com/36'
          }
          alt={activeChatUser.username}
          onError={e => e.target.src = `https://ui-avatars.com/api/?name=${activeChatUser.username}&size=42`}
          style={{
            width:        '36px',
            height:       '36px',
            borderRadius: '50%',
            objectFit:    'cover'
          }}
        />

        {/* Name */}
<span
  style={{
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontWeight: "600",
    fontSize: "14px",
  }}
>
  {activeChatUser.username}

  {/* <button onClick={()=>deleteChat(activeChatUser.id)}
    style={{
      marginLeft: "auto",
      backgroundColor: "#e1e1e1",
      color: "black",
      border: "none",
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      cursor: "pointer",
      fontSize: "16px",
    }}
  >
    🗑
  </button> */}
</span>
      </div>

      {/* ── Messages area ── */}
      <div style={{
        flex:      1,
        overflowY: 'auto',
        padding:   '12px',
        minHeight: 0,
        display:   'flex',
        flexDirection: 'column',
        gap:       '8px'
      }}>

        {/* no messages yet */}
        {messages.length === 0 && (
          <div style={{
            textAlign:  'center',
            color:      '#aaa',
            fontSize:   '13px',
            marginTop:  '30px'
          }}>
            No messages yet. Say hello! 👋
          </div>
        )}

     
        {messages.map((msg, i) => {
          const isMyMessage = msg.sender_id === currentUser.id;
          return (
            <div key={i} style={{
              display:        'flex',
              justifyContent: isMyMessage ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth:        '75%',
                padding:         '8px 12px',
                borderRadius:    isMyMessage
                  ? '16px 16px 4px 16px'
                  : '16px 16px 16px 4px',
                backgroundColor: isMyMessage ? '#0084ff' : '#f0f0f0',
                color:           isMyMessage ? 'white'   : '#222',
                fontSize:        '13px',
              }}>
                {msg.message}
              </div>
            </div>
          );
        })}
        {/* invisible div at bottom — used for auto scroll */}
        <div ref={bottomRef} />

      </div>

      {/* ── Input box ── */}
      <form
        onSubmit={handleSend}
        style={{
          display:      'flex',
          gap:          '8px',
          padding:      '10px 12px',
          borderTop:    '1px solid #ececec',
          flexShrink:   0
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
          style={{
            flex:         1,
            padding:      '8px 12px',
            borderRadius: '20px',
            border:       '1px solid #ddd',
            fontSize:     '13px',
            outline:      'none'
          }}
        />
        <button
          type="submit"
          style={{
            padding:         '8px 14px',
            borderRadius:    '20px',
            border:          'none',
            backgroundColor: '#0084ff',
            color:           'white',
            cursor:          'pointer',
            fontSize:        '13px'
          }}
        >
          ➤
        </button>
      </form>

    </div>

  </>
}

export default ChatWindow;