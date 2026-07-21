import { useContext } from "react"; 
import {useChat} from "../context/chatcontext.jsx";



function ChatList(props){
    
   
    const { chatList , openExistingChat,isChatOpen,setIsChatOpen} = useChat();
    // console.log('chatList', chatList);
    
    return (

        <div style={{
                display:       'flex',
                flexDirection: 'column',
                height:        '100%',
                overflow:       'hidden'
                }}>

        <div style={{
                padding:         '14px 16px',
                borderBottom:    '1px solid #ececec',
                backgroundColor: '#f9f9f9',
                borderRadius:    '12px 12px 0 0',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'space-between',
                flexShrink:       0
            }}>

                <span style={{ fontWeight: 'bold', fontSize: '16px' }}> 
                    💬Messages
                </span>
                <span style={{ fontSize: '12px', color: '#888' }}>
                    {chatList.length} conversation{chatList.length !== 1 ? 's' : '' }
                </span>
                <button onClick={() => {
                    setIsChatOpen(!isChatOpen) }}>❌</button>
                 </div>


            <div style={{
                    flex:      1,            
                    overflowY: 'auto',     
                    minHeight: 0            
                }}>

                {chatList.length === 0 && (
                     <div style={{
                        textAlign:  'center',
                        marginTop:  '40px',
                        color:      '#aaa',
                        fontSize:   '14px'
                    }}>
                         No Conversation yet
                        </div>
                ) }

                {chatList.map((user) => (
                    <ChatListItem 
                        key = {user.id}
                        user = {user}
                        onClick = {() => openExistingChat(user)}
                    />
                ))}
            </div>

        </div>

    );
}


function ChatListItem({user, onClick}){

    // console.log(user.avatar);
    return (
        <div 
        onClick = {onClick} 
            style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '12px',
            padding:      '12px 16px',
            cursor:       'pointer',
            borderBottom: '1px solid #f0f0f0',
            transition:   'background 0.15s',
            }}    
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
  
      >

        <img  src={
            user.avatar
              ? `${import.meta.env.VITE_API_URL}${user.avatar}`
              : 'https://via.placeholder.com/36'
          } alt= {user.username}
                style={{
                            width:        '42px',
                            height:       '42px',
                            borderRadius: '50%',
                            objectFit:    'cover',
                            flexShrink:   0
                        }}
            // onError={e => e.target.src = 'https://via.placeholder.com/42'}

        />


    <div  style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight:   '600',
          fontSize:     '14px',
          color:        '#222',
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis'
        }}>
          {user.username}
        </div>
        <div style={{
          fontSize:     '12px',
          color:        '#999',
          marginTop:    '2px',
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis'
        }}>
          Click to open chat
        </div>
      </div>

      {/* arrow indicator */}
      <span style={{ color: '#ccc', fontSize: '16px' }}>›</span>

        </div>
    );
}


export default ChatList;
