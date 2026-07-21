import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar.jsx";
import './styles/profile.css';
import defaultImg from "../public/user_profile.png";
import { useRef } from "react";
import {useUser} from "./context/usercontext.jsx";


function RandomProfile() {
  const fileInputRef = useRef(null);
  const [loggedin, setLoggedin] = useState(false);
  const [postData, setPostData] = useState();
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const {userProfile,setUserProfile} = useUser();

  const navigate = useNavigate();

const handleView = (post) => {
  // console.log("Viewing post:", post);
  setSelectedPost(post);
  setShowModal(true);
};
  
const { id } = useParams();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/dashboard/profile/userposts/${id}`, {
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setPostData(data.user);
        // console.log(data.user);
        setLoggedin(true);
      })
      .catch(() => {
        setLoggedin(false);
        navigate("/login");
      });
  }, [id]);


  //--------------------------------------------------------------------

useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/dashboard/profile/${id}`, {
    credentials: "include"
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then((data) => {
      setData(data);
      setLoggedin(true);
    })
    .catch(() => {
      setLoggedin(false);
      navigate("/login");
    });
}, [id]);



  return <>
    <Navbar loggedin={loggedin} profileImg={userProfile?.user?.profileimglink ? `${import.meta.env.VITE_API_URL}${userProfile.user.profileimglink}` : defaultImg} />
{/* <h1>{userProfile.imageUrl}</h1> */}
    <div className="userProfile">
      <div className="profile-header">
        {/* Profile Image with Edit Option */}
        <div className="profile-img-container">
          <img
            src={data?.user?.profileimglink ? `${import.meta.env.VITE_API_URL}${data.user.profileimglink}?t=${Date.now()}` : defaultImg} alt="Profile" />          
        </div>

        <div className="profile-info">

          {data && data.user ? (
            <div>
              <h3>{data.user.username}</h3>
              <h4>{data.user.college} </h4>
              <h5>Current-year: {data.user.currentyear}</h5>
            </div>
          ) : (
            <p>Loading...</p>
          )}
          <div className="campus-badge">🎓 Campus ID: DU2023CSE045</div>
        </div>

    

      </div>



      <hr />
      <div className="post-container">
        {postData && postData.length > 0 ? (
          postData.map(post => (
            <div key={post.id} className={`post-card ${post.isInactive ? "inactive" : ""}`}>
              <img src={`${import.meta.env.VITE_API_URL}${post.imglink}`} alt="post" />
              <h2>{post.post_title}</h2>
              <h2>{post.post_price}</h2>

              <p>{post.post_description}</p>
              <div className="action-btns">
                    <button className="action-btn secondary" onClick={() => handleActive(post.id)}>Message</button>
                  <button className="action-btn secondary" onClick={() => handleView(post)}>view</button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts yet</p>
        )}

      </div>


    </div>


      {showModal && selectedPost && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content"  onClick={(e) => e.stopPropagation()} >
            <button  className="close-btn"  onClick={() => setShowModal(false)} > ✖ </button>
           
           
            {/* <div className="modal-user">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${selectedPost.profileimglink}`}
                    alt=""
                  />
                  <div>
                    <h3>{selectedPost.username}</h3>
                    <p>{selectedPost.college}</p>
                  </div>
                </div> */}

            <div className="modal-post">
            <img src={`${import.meta.env.VITE_API_URL}${selectedPost.imglink}`} alt="post"  />
            <h2>{selectedPost.post_title}</h2>
            <h2>₹{selectedPost.post_price}</h2>
            <p>{selectedPost.post_description}</p>
            </div>
          </div>
        </div>
      )}








    

  </>
}

export default RandomProfile;