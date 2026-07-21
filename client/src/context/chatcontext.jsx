import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {

    const [chatList, setChatList] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeChatUser, setActiveChatUser] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/chatlist`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setChatList(data);
            })
            .catch(err => console.error('chatlist load error:', err));
    }, []);

    const openChatWith = (user) => {
        setChatList(prev => {
            const alreadyExists = prev.find(u => u.id === user.id);
            if (alreadyExists) return prev;
            return [user, ...prev];
        });
    };

    const goBackToList = () => setActiveChatUser(null);
    const openExistingChat = (user) => setActiveChatUser(user);

    return (
        <ChatContext.Provider value={{
            isChatOpen,
            setIsChatOpen,
            chatList,
            activeChatUser,
            openChatWith,
            goBackToList,
            openExistingChat
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);