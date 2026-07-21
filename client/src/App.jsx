import { useState } from 'react'
import { Router,Routes, Route ,Link} from "react-router-dom";

import Home from './home'
import Signup from './signup'
import Login from './login'
import Dashboard from './dashboard';
import Profile from './profile';
import RandomProfile from './randomprofile';
import { UserProvider } from './context/usercontext';


function App() {
  const [count, setCount] = useState(0)

  

  return <>

    <UserProvider>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          <UserProvider><Dashboard /></UserProvider>
        } />
        <Route path="/dashboard/profile" element={
          <UserProvider><Profile /></UserProvider>
        } />
        <Route path="/dashboard/randomprofile/:id" element={
          <UserProvider><RandomProfile /></UserProvider>
        } />
      </Routes>
</UserProvider>

  
  </>
}

export default App
