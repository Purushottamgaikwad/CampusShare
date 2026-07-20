import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";
import defaultImg from "../public/user_profile.png";
import { useChat } from "./context/chatcontext";
import "./styles/navbar.css"


function Navbar({loggedin,profileImg}){
  
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const {setIsChatOpen,isChatOpen} = useChat();
  const lastScrollY = useRef(0);


const handleLogout = async () => {
    const result = confirm("Are you sure you want to delete?");
    // console.log(result);
    if (result) {
      // User clicked OK
      console.log("baher");
      await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include" 
        });
    navigate("/login");
    
    }else {
      // User clicked Cancel
      console.log("Cancelled");
    }
  
};





  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        // scrolling down
        setVisible(false);
      } else {
        // scrolling up
        setVisible(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 

    return <div id="navbar" className={visible ? "show" : "hide"}>
            <nav id="leftnavbar">
                <h1><Link to="/">Campus_Share</Link> </h1><p>Share More, Pay Less</p>
            </nav> 
            <ul>
              {!loggedin? (<>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Signup</Link></li>
                            </>
                          )
                         :(<>
                            {/* <li></li> */}
                            <li><Link to="/dashboard/profile"><img src={ profileImg.startsWith("/uploads") ? `http://localhost:5000${profileImg}`: profileImg} alt="userimag"/>profile</Link></li>
                            <li><Link  onClick={handleLogout}>Logout</Link></li>
                            <li><Link onClick = {()=>{setIsChatOpen(!isChatOpen)}}>Messages💬</Link></li>
                            </>
                             )
            }
                    
                </ul>
           </div>
}

export default Navbar;