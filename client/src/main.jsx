import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChatProvider } from "./context/chatcontext.jsx";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
   
   
   <BrowserRouter>
   <ChatProvider> 
    <App />
  
  </ChatProvider>
  </BrowserRouter>
)
