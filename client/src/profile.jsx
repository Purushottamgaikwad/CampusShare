
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar.jsx";
import './styles/profile.css';
import defaultImg from "../public/user_profile.png";
import { useRef } from "react";


function Profile() {
  const fileInputRef = useRef(null);
  const [loggedin, setLoggedin] = useState(false);
  const [postData, setPostData] = useState();
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState("none");
  const [active, setActive] = useState("");

  const [post, setPost] = useState("none");
  const [previewImg, setPreviewImg] = useState(null); // for UI
  const [imageFile, setImageFile] = useState(null);   // for backend
  const [profileImageFile, setProfileImageFile] = useState(null);   // for backend

  const navigate = useNavigate();
  const [formData, setformData] = useState({ username: "", collegeName: "", currentYear: "", email: "" });

  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postFormData, setPostFormData] = useState({});




  // const handleActive = (postId) => {

  //   setPostData(prev =>
  //     prev.map(post => post.id === postId ? { ...post, isInactive: !post.isInactive }
  //       : post
  //     )
  //   );
  // }
  //--------------------------------------------------------------------
  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    });
    console.log(formData);
  };
  //---------------------------------------------------------------------------
  const handlePostChange = (e) => {
    setPostFormData({
      ...postFormData,
      [e.target.name]: e.target.value
    });
    console.log(postFormData);
  };

  //--------------------------------------------------------------------

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(e.target.files[0]);
    setPreviewImg(URL.createObjectURL(e.target.files[0]));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log(file);
    setProfileImageFile(file);

  };

  //-------------------------------------------------------------------


  useEffect(() => {
    if (!profileImageFile) return;

    const formData = new FormData();
    formData.append("profileImage", profileImageFile);

    fetch("http://localhost:5000/dashboard/profile/img", {
      method: "PUT",
      credentials: "include",
      body: formData
    })
      .then(res => res.json())
      .then(result => {
        setData(prev => ({
          ...prev,
          user: {
            ...prev.user,
            profileimglink: result.profileimglink
          }
        }));
      })
      .catch(err => console.log(err));

  }, [profileImageFile]);

//-----------------------------------------------------------------------------

const handleView = (post) => {
  setSelectedPost(post);
  setShowModal(true);
};
  
  //--------------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/dashboard/edit", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          username: formData.username,
          college: formData.collegeName,
          currentyear: formData.currentYear,
          email: formData.email
        }
      }));
      alert("Profile updated successfully");
      if (edit == "none") {
        setEdit("block");
      } else {
        setEdit("none");
      }
    } else {
      alert("Update failed");
    }
  };
  //--------------------------------------------------------------------
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();

    // ✅ append text fields
    formData.append("post_title", postFormData.post_title);
    formData.append("post_price", postFormData.post_price);
    formData.append("post_description", postFormData.post_description);
    formData.append("post_category", postFormData.category);

    // ✅ append image file (KEY NAME MUST MATCH multer)
    formData.append("image", imageFile);

    const res = await fetch("http://localhost:5000/dashboard/profile/post", {
      method: "POST",
      credentials: "include",
      body: formData, // ❗ NO headers here
    });

    if (res.ok) {
      alert("Post uploaded successfully");
      setPost(prev => (prev === "none" ? "block" : "none"));
    } else {
      alert("Upload failed");
    }
  };

  //--------------------------------------------------------------------

  const handleEdit = () => {
    if (edit == "none") {
      setEdit("block");
    } else {
      setEdit("none");
    }

  }
  //--------------------------------------------------------------------
  const handlePost = () => {
    if (post == "none") {
      setPost("block");
    } else {
      setPost("none");
    }

  }
  //-------------------------------------------------------------
  const handleDelete = async (postId) => {
    const confirmResponse = confirm("Are you sure you want to delete this post ?");
    if (confirmResponse) {

      const res = await fetch(
        `http://localhost:5000/dashboard/profile/userposts/${postId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        setPostData(prev =>
          prev.filter(post => post.id !== postId)
        );
      } else {
        alert("Delete failed");
      }
    };



  };

  //-------------------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:5000/dashboard/profile/userposts", {
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
  }, []);

  //-------------------------------------------------------------

  //--------------------------------------------------------------------
  useEffect(() => {
    if (data?.user) {
      setformData({
        username: data.user.username || "",
        collegeName: data.user.college || "",
        currentYear: data.user.currentyear || "",
        email: data.user.email || "",
      });
    }
  }, [data]);

  //--------------------------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:5000/dashboard/profile", {
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setData(data);
        // console.log(data);
        setLoggedin(true);
      })
      .catch(() => {
        setLoggedin(false);
        navigate("/login");
      });
  }, []);


  return <>
    <Navbar loggedin={loggedin} profileImg={data?.user?.profileimglink ? data.user.profileimglink : defaultImg} />

    <div className="userProfile">
      <div className="profile-header">
        {/* Profile Image with Edit Option */}
        <div className="profile-img-container">
          <img
            src={data?.user?.profileimglink ? `http://localhost:5000${data.user.profileimglink}?t=${Date.now()}` : defaultImg} alt="Profile" />
          <button className="edit-img-btn" title="Change photo" onClick={() => fileInputRef.current.click()}>📷</button>
          <input id="profile"
            type="file"
            ref={fileInputRef}
            accept="image/*"
            hidden
            onChange={handleProfileImageChange}
          />
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

        {/* ACTION BUTTONS */}
        <div className="profile-actions">
          <button onClick={handleEdit} className="action-btn primary">✏️ Edit Profile</button>
          <button onClick={handlePost} className="action-btn secondary">Add post</button>
        </div>


      </div>
      <div className="updateForm" style={{ display: edit }}>
        {data && data.user ? (
          <form onSubmit={handleSubmit} >
            <input type="text" name="username" placeholder={data.user.username} onChange={handleChange} />
            <select name="collegeName" onChange={handleChange}>
              <option value={data.user.college}>{data.user.college}</option>
              <option value="A. P. Shah Institute of Technology, Thane">A. P. Shah Institute of Technology, Thane</option>
              <option value="Adsul's Technical Campus, Chas Dist. Ahmednagar">Adsul's Technical Campus, Chas Dist. Ahmednagar</option>
              <option value="Adarsh Shikshan Prasarak Mandal's K. T. Patil College of Engineering and Technology, Osmanabad">Adarsh Shikshan Prasarak Mandal's K. T. Patil College of Engineering and Technology, Osmanabad</option>
              <option value="Aditya Engineering College , Beed">Aditya Engineering College , Beed</option>
              <option value="Agnel Charities' FR. C. Rodrigues Institute of Technology, Vashi, Navi Mumbai">Agnel Charities' FR. C. Rodrigues Institute of Technology, Vashi, Navi Mumbai</option>
              <option value="Agnihotri College of Engineering, Sindhi(Meghe)">Agnihotri College of Engineering, Sindhi(Meghe)</option>
              <option value="Ahmednagar Jilha Maratha Vidya Prasarak Samajache, Shri. Chhatrapati Shivaji Maharaj College of Engineering, Nepti">Ahmednagar Jilha Maratha Vidya Prasarak Samajache, Shri. Chhatrapati Shivaji Maharaj College of Engineering, Nepti</option>
              <option value="Ajeenkya DY Patil School of Engineering, Lohegaon, Pune">Ajeenkya DY Patil School of Engineering, Lohegaon, Pune</option>
              <option value="Al-Ameen Educational and Medical Foundation, College of Engineering, Koregaon, Bhima">Al-Ameen Educational and Medical Foundation, College of Engineering, Koregaon, Bhima</option>
              <option value="Alard Charitable Trust's Alard College of Engineering and Management, Pune">Alard Charitable Trust's Alard College of Engineering and Management, Pune</option>
              <option value="Aldel Education Trust's St. John College of Engineering & Management, Vevoor, Palghar">Aldel Education Trust's St. John College of Engineering & Management, Vevoor, Palghar</option>
              <option value="All India Shri Shivaji Memorial Society's College of Engineering, Pune">All India Shri Shivaji Memorial Society's College of Engineering, Pune</option>
              <option value="All India Shri Shivaji Memorial Society's Institute of Information Technology,Pune">All India Shri Shivaji Memorial Society's Institute of Information Technology,Pune</option>
              <option value="Amolak College of Engineering Kada">Amolak College of Engineering Kada</option>
              <option value="Amruta Vaishnavi Education & Welfare Trust's Shatabdi Institute of Engineering & Research, Agaskhind Tal. Sinnar">Amruta Vaishnavi Education & Welfare Trust's Shatabdi Institute of Engineering & Research, Agaskhind Tal. Sinnar</option>
              <option value="Amrutvahini Sheti & Shikshan Vikas Sanstha's Amrutvahini College of Engineering, Sangamner">Amrutvahini Sheti & Shikshan Vikas Sanstha's Amrutvahini College of Engineering, Sangamner</option>
              <option value="Anantrao Pawar College of Engineering & Research, Pune">Anantrao Pawar College of Engineering & Research, Pune</option>
              <option value="Anjuman College of Engineering & Technology, Nagpur">Anjuman College of Engineering & Technology, Nagpur</option>
              <option value="Anjuman-I-Islam's Kalsekar Technical Campus, Panvel">Anjuman-I-Islam's Kalsekar Technical Campus, Panvel</option>
              <option value="Anjuman-I-Islam's M.H. Saboo Siddik College of Engineering, Byculla, Mumbai">Anjuman-I-Islam's M.H. Saboo Siddik College of Engineering, Byculla, Mumbai</option>
              <option value="Annasaheb Dange College of Engineering and Technology, Ashta, Sangli">Annasaheb Dange College of Engineering and Technology, Ashta, Sangli</option>
              <option value="Anuradha College Of Engineering & Technology">Anuradha College Of Engineering & Technology</option>
              <option value="Appasaheb Alias Sa.Re.Patil Institute Of Technology, Dattanagar Tal-Shirol, Dist Kolhapur">Appasaheb Alias Sa.Re.Patil Institute Of Technology, Dattanagar Tal-Shirol, Dist Kolhapur</option>
              <option value="Ashok Institute of Engineering & Technology">Ashok Institute of Engineering & Technology</option>
              <option value="Atharva College of Engineering,Malad(West),Mumbai">Atharva College of Engineering,Malad(West),Mumbai</option>
              <option value="Audyogik Shikshan Mandal's Nextgen Technical Campus">Audyogik Shikshan Mandal's Nextgen Technical Campus</option>
              <option value="Aurangabad College of Engineering, Naygaon Savangi, Aurangabad">Aurangabad College of Engineering, Naygaon Savangi, Aurangabad</option>
              <option value="B.R. Harne College of Engineering & Technology, Karav, Tal-Ambernath.">B.R. Harne College of Engineering & Technology, Karav, Tal-Ambernath.</option>
              <option value="Babasaheb Phadtare Engineering & Technology Kalamb-Walchandnagar Tal Indapur Dist Pune">Babasaheb Phadtare Engineering & Technology Kalamb-Walchandnagar Tal Indapur Dist Pune</option>
              <option value="Bajaj Institute of Technology, Wardha">Bajaj Institute of Technology, Wardha</option>
              <option value="Bansilal Ramnath Agarawal Charitable Trust's Vishwakarma Institute of Technology, Bibwewadi, Pune">Bansilal Ramnath Agarawal Charitable Trust's Vishwakarma Institute of Technology, Bibwewadi, Pune</option>
              <option value="Bapurao Deshmukh College of Engineering, Sevagram">Bapurao Deshmukh College of Engineering, Sevagram</option>
              <option value="Bhagwant Institute of Technology, Barshi">Bhagwant Institute of Technology, Barshi</option>
              <option value="Bharat College of Engineering, Kanhor, Badlapur(W)">Bharat College of Engineering, Kanhor, Badlapur(W)</option>
              <option value="Bharati Vidyapeeth College of Engineering, Navi Mumbai">Bharati Vidyapeeth College of Engineering, Navi Mumbai</option>
              <option value="Bharati Vidyapeeth's College of Engineering for Women, Katraj, Dhankawadi, Pune">Bharati Vidyapeeth's College of Engineering for Women, Katraj, Dhankawadi, Pune</option>
              <option value="Bharati Vidyapeeth's College of Engineering, Kolhapur">Bharati Vidyapeeth's College of Engineering, Kolhapur</option>
              <option value="Bharati Vidyapeeth's College of Engineering,Lavale, Pune">Bharati Vidyapeeth's College of Engineering,Lavale, Pune</option>
              <option value="Bhartiya Vidya Bhavan's Sardar Patel Institute of Technology , Andheri, Mumbai">Bhartiya Vidya Bhavan's Sardar Patel Institute of Technology , Andheri, Mumbai</option>
              <option value="Brahma Valley College of Engineering & Research, Trimbakeshwar, Nashik">Brahma Valley College of Engineering & Research, Trimbakeshwar, Nashik</option>
              <option value="CDS College of Engineering">CDS College of Engineering</option>
              <option value="COEP Technological University">COEP Technological University</option>
              <option value="CSMSS Chh. Shahu College of Engineering, Aurangabad">CSMSS Chh. Shahu College of Engineering, Aurangabad</option>
              <option value="Chhartrapati Shivaji Maharaj Institute of Technology, Shedung, Panvel">Chhartrapati Shivaji Maharaj Institute of Technology, Shedung, Panvel</option>
              <option value="College of Engineering and Technology ,North Maharashtra Knowledge City, Jalgaon">College of Engineering and Technology ,North Maharashtra Knowledge City, Jalgaon</option>
              <option value="Cummins College of Engineering For Women, Sukhali (Gupchup), Tal. Hingna Hingna Nagpur">Cummins College of Engineering For Women, Sukhali (Gupchup), Tal. Hingna Hingna Nagpur</option>
              <option value="D.Y. Patil College of Engineering and Technology, Kolhapur">D.Y. Patil College of Engineering and Technology, Kolhapur</option>
              <option value="D.Y.Patil Education Society's,D.Y.Patil Technical Campus, Faculty of Engineering & Faculty of Management,Talsande,Kolhapur.">D.Y.Patil Education Society's,D.Y.Patil Technical Campus, Faculty of Engineering & Faculty of Management,Talsande,Kolhapur.</option>
              <option value="Dattajirao Kadam Technical Education Society's Textile & Engineering Institute, Ichalkaranji.">Dattajirao Kadam Technical Education Society's Textile & Engineering Institute, Ichalkaranji.</option>
              <option value="Dattakala Group Of Institutions, Swami - Chincholi Tal. Daund Dist. Pune">Dattakala Group Of Institutions, Swami - Chincholi Tal. Daund Dist. Pune</option>
              <option value="Deogiri Institute of Engineering and Management Studies, Aurangabad">Deogiri Institute of Engineering and Management Studies, Aurangabad</option>
              <option value="Department of Technology, Shivaji University, Kolhapur">Department of Technology, Shivaji University, Kolhapur</option>
              <option value="Devi Mahalaxmi College of Engineering and Technology">Devi Mahalaxmi College of Engineering and Technology</option>
              <option value="Dhole Patil Education Society, Dhole Patil College of Engineering, Wagholi, Tal. Haveli">Dhole Patil Education Society, Dhole Patil College of Engineering, Wagholi, Tal. Haveli</option>
              <option value="Dilkap Research Institute Of Engineering and Management Studies, At.Mamdapur, Post- Neral, Tal- Karjat, Mumbai">Dilkap Research Institute Of Engineering and Management Studies, At.Mamdapur, Post- Neral, Tal- Karjat, Mumbai</option>
              <option value="Dnyanshree Institute Engineering and Technology, Satara">Dnyanshree Institute Engineering and Technology, Satara</option>
              <option value="Dnyanvilas College Of Engineering">Dnyanvilas College Of Engineering</option>
              <option value="Don Bosco Institute of Technology, Mumbai">Don Bosco Institute of Technology, Mumbai</option>
              <option value="Dr. A. D. Shinde College Of Engineering, Tal.Gadhinglaj, Kolhapur">Dr. A. D. Shinde College Of Engineering, Tal.Gadhinglaj, Kolhapur</option>
              <option value="Dr. Ashok Gujar Technical Institute's Dr. Daulatrao Aher College of Engineering, Karad">Dr. Ashok Gujar Technical Institute's Dr. Daulatrao Aher College of Engineering, Karad</option>
              <option value="Dr. Babasaheb Ambedkar Technological University, Lonere">Dr. Babasaheb Ambedkar Technological University, Lonere</option>
              <option value="Dr. D Y Patil Pratishthan's College of Engineering, Kolhapur">Dr. D Y Patil Pratishthan's College of Engineering, Kolhapur</option>
              <option value="Dr. D. Y. Patil Pratishthan's D.Y.Patil College of Engineering Akurdi, Pune">Dr. D. Y. Patil Pratishthan's D.Y.Patil College of Engineering Akurdi, Pune</option>
              <option value="Dr. D. Y. Patil Unitech Society's Dr. D. Y. Patil Institute of Technology, Pimpri, Pune">Dr. D. Y. Patil Unitech Society's Dr. D. Y. Patil Institute of Technology, Pimpri, Pune</option>
              <option value="Dr. D.Y. Patil College Of Engineering & Innovation,Talegaon">Dr. D.Y. Patil College Of Engineering & Innovation,Talegaon</option>
              <option value="Dr. D.Y. Patil Technical Campus, Varale, Talegaon, Pune">Dr. D.Y. Patil Technical Campus, Varale, Talegaon, Pune</option>
              <option value="Dr. J. J. Magdum Charitable Trust's Dr. J.J. Magdum College of Engineering, Jaysingpur">Dr. J. J. Magdum Charitable Trust's Dr. J.J. Magdum College of Engineering, Jaysingpur</option>
              <option value="Dr. V.K. Patil College of Engineering & Technology">Dr. V.K. Patil College of Engineering & Technology</option>
              <option value="Dr. Vithalrao Vikhe Patil College of Engineering, Ahmednagar">Dr. Vithalrao Vikhe Patil College of Engineering, Ahmednagar</option>
              <option value="Dr.Rajendra Gode Institute of Technology & Research, Amravati">Dr.Rajendra Gode Institute of Technology & Research, Amravati</option>
              <option value="Dwarka Bahu Uddeshiya Gramin Vikas Foundation, Rajarshi Shahu College of Engineering, Buldhana">Dwarka Bahu Uddeshiya Gramin Vikas Foundation, Rajarshi Shahu College of Engineering, Buldhana</option>
              <option value="Eaglewood Polytechnic Institute, A.P Phulepimpalgaon">Eaglewood Polytechnic Institute, A.P Phulepimpalgaon</option>
              <option value="Everest Education Society, Group of Institutions (Integrated Campus), Ohar">Everest Education Society, Group of Institutions (Integrated Campus), Ohar</option>
              <option value="Excelsior Education Society's K.C. College of Engineering and Management Studies and Research, Kopri, Thane (E)">Excelsior Education Society's K.C. College of Engineering and Management Studies and Research, Kopri, Thane (E)</option>
              <option value="Fabtech Technical Campus College of Engineering and Research, Sangola">Fabtech Technical Campus College of Engineering and Research, Sangola</option>
              <option value="Flora Institute of Technology, Khopi, Near Khed Shivapur Toll Plaza, Pune">Flora Institute of Technology, Khopi, Near Khed Shivapur Toll Plaza, Pune</option>
              <option value="Fr. Conceicao Rodrigues College of Engineering, Bandra,Mumbai">Fr. Conceicao Rodrigues College of Engineering, Bandra,Mumbai</option>
              <option value="G. S. Mandal's Maharashtra Institute of Technology, Aurangabad">G. S. Mandal's Maharashtra Institute of Technology, Aurangabad</option>
              <option value="G.H.Raisoni College of Engineering & Management, Wagholi, Pune">G.H.Raisoni College of Engineering & Management, Wagholi, Pune</option>
              <option value="G.M.Vedak Institute of Technology, Tala, Raigad.">G.M.Vedak Institute of Technology, Tala, Raigad.</option>
              <option value="Genba Sopanrao Moze College of Engineering, Baner-Balewadi, Pune">Genba Sopanrao Moze College of Engineering, Baner-Balewadi, Pune</option>
              <option value="Genba Sopanrao Moze Trust Parvatibai Genba Moze College of Engineering,Wagholi, Pune">Genba Sopanrao Moze Trust Parvatibai Genba Moze College of Engineering,Wagholi, Pune</option>
              <option value="Gharda Foundation's Gharda Institute of Technology,Khed, Ratnagiri">Gharda Foundation's Gharda Institute of Technology,Khed, Ratnagiri</option>
              <option value="Godavari Foundation's Godavari College Of Engineering, Jalgaon">Godavari Foundation's Godavari College Of Engineering, Jalgaon</option>
              <option value="Gokhale Education Society's, R.H. Sapat College of Engineering, Management Studies and Research, Nashik">Gokhale Education Society's, R.H. Sapat College of Engineering, Management Studies and Research, Nashik</option>
              <option value="Gondia Education Society's Manoharbhai Patel Institute Of Engineering & Technology, Shahapur, Bhandara">Gondia Education Society's Manoharbhai Patel Institute Of Engineering & Technology, Shahapur, Bhandara</option>
              <option value="Government College of Engineering & Research, Avasari Khurd">Government College of Engineering & Research, Avasari Khurd</option>
              <option value="Government College of Engineering, Amravati">Government College of Engineering, Amravati</option>
              <option value="Government College of Engineering, Chandrapur">Government College of Engineering, Chandrapur</option>
              <option value="Government College of Engineering, Chhatrapati Sambhajinagar">Government College of Engineering, Chhatrapati Sambhajinagar</option>
              <option value="Government College of Engineering, Jalgaon">Government College of Engineering, Jalgaon</option>
              <option value="Government College of Engineering, Karad">Government College of Engineering, Karad</option>
              <option value="Government College of Engineering, Kolhapur">Government College of Engineering, Kolhapur</option>
              <option value="Government College of Engineering, Nagpur">Government College of Engineering, Nagpur</option>
              <option value="Government College of Engineering,Yavatmal">Government College of Engineering,Yavatmal</option>
              <option value="Gramin Technical And Management Campus Nanded.">Gramin Technical And Management Campus Nanded.</option>
              <option value="Guru Gobind Singh College of Engineering & Research Centre, Nashik.">Guru Gobind Singh College of Engineering & Research Centre, Nashik.</option>
              <option value="Guru Nanak Institute of Engineering & Technology,Kalmeshwar, Nagpur">Guru Nanak Institute of Engineering & Technology,Kalmeshwar, Nagpur</option>
              <option value="Gurunanak Educational Society's Gurunanak Institute of Technology, Nagpur">Gurunanak Educational Society's Gurunanak Institute of Technology, Nagpur</option>
              <option value="Haji Jamaluddin Thim Trust's Theem College of Engineering, At. Villege Betegaon, Boisar">Haji Jamaluddin Thim Trust's Theem College of Engineering, At. Villege Betegaon, Boisar</option>
              <option value="Hindi Seva Mandal's Shri Sant Gadgebaba College of Engineering & Technology, Bhusawal">Hindi Seva Mandal's Shri Sant Gadgebaba College of Engineering & Technology, Bhusawal</option>
              <option value="Hi-Tech Institute of Technology, Aurangabad">Hi-Tech Institute of Technology, Aurangabad</option>
              <option value="Hon. Shri. Babanrao Pachpute Vichardhara Trust, Group of Institutions (Integrated Campus)-Parikrama, Kashti Shrigondha,">Hon. Shri. Babanrao Pachpute Vichardhara Trust, Group of Institutions (Integrated Campus)-Parikrama, Kashti Shrigondha,</option>
              <option value="Hope Foundation and research center's Finolex Academy of Management and Technology, Ratnagiri">Hope Foundation and research center's Finolex Academy of Management and Technology, Ratnagiri</option>
              <option value="ISBM College Of Engineering Pune">ISBM College Of Engineering Pune</option>
              <option value="Ideal Institute of Technology, Wada, Dist.Thane">Ideal Institute of Technology, Wada, Dist.Thane</option>
              <option value="Imperial College of Engineering">Imperial College of Engineering</option>
              <option value="Indala College Of Engineering, Bapsai Tal.Kalyan">Indala College Of Engineering, Bapsai Tal.Kalyan</option>
              <option value="Indira College of Engineering & Management, Pune">Indira College of Engineering & Management, Pune</option>
              <option value="Institute of Chemical Technology, Matunga, Mumbai">Institute of Chemical Technology, Matunga, Mumbai</option>
              <option value="Institute of Chemical Technology, Mumbai Marathwada off campus, Jalna">Institute of Chemical Technology, Mumbai Marathwada off campus, Jalna</option>
              <option value="International Centre Of Excellence In Engineering and Management (ICEEM)">International Centre Of Excellence In Engineering and Management (ICEEM)</option>
              <option value="International Institute of Information Technology (I²IT), Pune.">International Institute of Information Technology (I²IT), Pune.</option>
              <option value="JSPM College of Engineering, Latur">JSPM College of Engineering, Latur</option>
              <option value="JSPM Narhe Technical Campus, Pune.">JSPM Narhe Technical Campus, Pune.</option>
              <option value="JSPM'S Jaywantrao Sawant College of Engineering,Pune">JSPM'S Jaywantrao Sawant College of Engineering,Pune</option>
              <option value="Jagadamba Bahuuddeshiya Gramin Vikas Sanstha's Jagdambha College of Engineering and Technology, Yavatmal">Jagadamba Bahuuddeshiya Gramin Vikas Sanstha's Jagdambha College of Engineering and Technology, Yavatmal</option>
              <option value="Jagadamba Education Soc. Nashik's S.N.D. College of Engineering & Reserch, Babulgaon">Jagadamba Education Soc. Nashik's S.N.D. College of Engineering & Reserch, Babulgaon</option>
              <option value="Jai Mahakali Shikshan Sanstha, Agnihotri College of Engineering, Sindhi(Meghe)">Jai Mahakali Shikshan Sanstha, Agnihotri College of Engineering, Sindhi(Meghe)</option>
              <option value="Jaihind College Of Engineering,Kuran">Jaihind College Of Engineering,Kuran</option>
              <option value="Jaidev Education Society, J D College of Engineering and Management, Nagpur">Jaidev Education Society, J D College of Engineering and Management, Nagpur</option>
              <option value="Jamia Institute Of Technology">Jamia Institute Of Technology</option>
              <option value="Janata Shikshan Prasarak Mandals Babasaheb Naik College Of Engineering, Pusad">Janata Shikshan Prasarak Mandals Babasaheb Naik College Of Engineering, Pusad</option>
              <option value="Jawahar Education Society's Annasaheb Chudaman Patil College of Engineering,Kharghar, Navi Mumbai">Jawahar Education Society's Annasaheb Chudaman Patil College of Engineering,Kharghar, Navi Mumbai</option>
              <option value="Jawahar Education Society's Institute of Technology, Management & Research, Nashik.">Jawahar Education Society's Institute of Technology, Management & Research, Nashik.</option>
              <option value="Jawaharlal Darda Institute of Engineering and Technology, Yavatmal">Jawaharlal Darda Institute of Engineering and Technology, Yavatmal</option>
              <option value="Jayawant Shikshan Prasarak Mandal, Bhivarabai Sawant Institute of Technology & Research, Wagholi">Jayawant Shikshan Prasarak Mandal, Bhivarabai Sawant Institute of Technology & Research, Wagholi</option>
              <option value="Jaywant College of Engineering & Polytechnic , Kille Macchindragad Tal. Walva District- Sangali">Jaywant College of Engineering & Polytechnic , Kille Macchindragad Tal. Walva District- Sangali</option>
              <option value="Jaywant Shikshan Prasarak Mandal's,Rajarshi Shahu College of Engineering, Tathawade, Pune">Jaywant Shikshan Prasarak Mandal's,Rajarshi Shahu College of Engineering, Tathawade, Pune</option>
              <option value="Jijau Institute of Engineering Technology and Management, Khandgaon (Bendri), Taluka Naigaon, District Nanded">Jijau Institute of Engineering Technology and Management, Khandgaon (Bendri), Taluka Naigaon, District Nanded</option>
              <option value="K. E. Society's Rajarambapu Institute of Technology, Walwa, Sangli">K. E. Society's Rajarambapu Institute of Technology, Walwa, Sangli</option>
              <option value="K. J.'s Educational Institut Trinity College of Engineering and Research, Pisoli, Haveli">K. J.'s Educational Institut Trinity College of Engineering and Research, Pisoli, Haveli</option>
              <option value="K. K. Wagh Institute of Engineering Education and Research, Nashik">K. K. Wagh Institute of Engineering Education and Research, Nashik</option>
              <option value="K.D.K. College of Engineering, Nagpur">K.D.K. College of Engineering, Nagpur</option>
              <option value="K.D.M. Education Society, Vidharbha Institute of Technology,Umred Road ,Nagpur">K.D.M. Education Society, Vidharbha Institute of Technology,Umred Road ,Nagpur</option>
              <option value="K.J Somaiya Institute of Technology">K.J Somaiya Institute of Technology</option>
              <option value="K.J.'s Educational Institute's K.J.College of Engineering & Management Research, Pisoli">K.J.'s Educational Institute's K.J.College of Engineering & Management Research, Pisoli</option>
              <option value="K.V.N. Naik S. P. Sansth's Loknete Gopinathji Munde Institute of Engineering Education & Research, Nashik.">K.V.N. Naik S. P. Sansth's Loknete Gopinathji Munde Institute of Engineering Education & Research, Nashik.</option>
              <option value="Kai Amdar Bramhadevdada Mane Shikshan & Samajik Prathistan's Bramhadevdada Mane Institute of Technology, Solapur">Kai Amdar Bramhadevdada Mane Shikshan & Samajik Prathistan's Bramhadevdada Mane Institute of Technology, Solapur</option>
              <option value="Kalyani Charitable Trust, Late Gambhirrao Natuba Sapkal College of Engineering, Anjaneri, Trimbakeshwar Road, Nashik">Kalyani Charitable Trust, Late Gambhirrao Natuba Sapkal College of Engineering, Anjaneri, Trimbakeshwar Road, Nashik</option>
              <option value="Karanjekar College of Engineering & Management, Sakoli">Karanjekar College of Engineering & Management, Sakoli</option>
              <option value="Karmayogi Institute of Technology">Karmayogi Institute of Technology</option>
              <option value="Kavi Kulguru Institute of Technology & Science, Ramtek">Kavi Kulguru Institute of Technology & Science, Ramtek</option>
              <option value="Kedareshwar Gramin Vikas Pratishthan, Samajbhushan Eknathrao Dhakane College, of Engineering, Shevgaon">Kedareshwar Gramin Vikas Pratishthan, Samajbhushan Eknathrao Dhakane College, of Engineering, Shevgaon</option>
              <option value="Keystone School of Engineering, Pune">Keystone School of Engineering, Pune</option>
              <option value="Khandesh College Education Society's College Of Engineering And Management, Jalgaon">Khandesh College Education Society's College Of Engineering And Management, Jalgaon</option>
              <option value="Kolhapur Institute of Technology's College of Engineering(Autonomous), Kolhapur">Kolhapur Institute of Technology's College of Engineering(Autonomous), Kolhapur</option>
              <option value="Konkan Gyanpeeth College of Engineering, Karjat">Konkan Gyanpeeth College of Engineering, Karjat</option>
              <option value="Koti Vidya Charitable Trust's Smt. Alamuri Ratnamala Institute of Engineering and Technology, Sapgaon, Tal. Shahapur">Koti Vidya Charitable Trust's Smt. Alamuri Ratnamala Institute of Engineering and Technology, Sapgaon, Tal. Shahapur</option>
              <option value="Krushi Jivan Vikas Pratishthan, Ballarpur Institute of Technology, Mouza Bamni">Krushi Jivan Vikas Pratishthan, Ballarpur Institute of Technology, Mouza Bamni</option>
              <option value="Late Narayandas Bhawandas Chhabada Institute of Engineering & Technology, Satara">Late Narayandas Bhawandas Chhabada Institute of Engineering & Technology, Satara</option>
              <option value="Laxminarayan Innovation Technological University, Nagpur">Laxminarayan Innovation Technological University, Nagpur</option>
              <option value="Leela Education Society, G.V. Acharya Institute of Engineering and Technology, Shelu, Karjat">Leela Education Society, G.V. Acharya Institute of Engineering and Technology, Shelu, Karjat</option>
              <option value="Lokmanya Tilak College of Engineering, Kopar Khairane, Navi Mumbai">Lokmanya Tilak College of Engineering, Kopar Khairane, Navi Mumbai</option>
              <option value="Lokmanya Tilak Jankalyan Shikshan Sanstha, Priyadarshani College of Engineering, Nagpur">Lokmanya Tilak Jankalyan Shikshan Sanstha, Priyadarshani College of Engineering, Nagpur</option>
              <option value="Loknete Hanumantrao Charitable Trust's Adarsh Institute of Technology and Research Centre, Vita,Sangli">Loknete Hanumantrao Charitable Trust's Adarsh Institute of Technology and Research Centre, Vita,Sangli</option>
              <option value="Loknete Shamrao Peje Government College of Engineering, Ratnagiri">Loknete Shamrao Peje Government College of Engineering, Ratnagiri</option>
              <option value="M.D. Yergude Memorial Shikshan Prasarak Mandal's Shri Sai College of Engineering & Technology, Bhadrawati">M.D. Yergude Memorial Shikshan Prasarak Mandal's Shri Sai College of Engineering & Technology, Bhadrawati</option>
              <option value="M.G.M.'s College of Engineering and Technology, Kamothe, Navi Mumbai">M.G.M.'s College of Engineering and Technology, Kamothe, Navi Mumbai</option>
              <option value="M.S. Bidve Engineering College, Latur">M.S. Bidve Engineering College, Latur</option>
              <option value="MAEER's MIT College of Railway Engineering and Research, Jamgaon, Barshi">MAEER's MIT College of Railway Engineering and Research, Jamgaon, Barshi</option>
              <option value="MAEER's Maharashtra Institute of Technology, Thane">MAEER's Maharashtra Institute of Technology, Thane</option>
              <option value="MET Bhujbal Knowledge City MET League's Engineering College, Adgaon, Nashik.">MET Bhujbal Knowledge City MET League's Engineering College, Adgaon, Nashik.</option>
              <option value="MET's Institute of Technology Polytechnic, Bhujbal Knowledge City, Adgaon Nashik">MET's Institute of Technology Polytechnic, Bhujbal Knowledge City, Adgaon Nashik</option>
              <option value="MES Mukunddas Lohia College Of Engineering">MES Mukunddas Lohia College Of Engineering</option>
              <option value="MIT Academy of Engineering,Alandi, Pune">MIT Academy of Engineering,Alandi, Pune</option>
              <option value="MKD Institute of Technology, Nadurbar">MKD Institute of Technology, Nadurbar</option>
              <option value="MKSSS's Cummins College of Engineering for Women, Karvenagar,Pune">MKSSS's Cummins College of Engineering for Women, Karvenagar,Pune</option>
              <option value="Maharashtra Institute of Technology, Aurangabad">Maharashtra Institute of Technology, Aurangabad</option>
              <option value="Mahatma Basaweshwar Education Society's College of Engineering, Ambejogai">Mahatma Basaweshwar Education Society's College of Engineering, Ambejogai</option>
              <option value="Mahatma Education Society's Pillai College of Engineering, New Panvel">Mahatma Education Society's Pillai College of Engineering, New Panvel</option>
              <option value="Mahatma Education Society's Pillai HOC College of Engineering & Technology, Tal. Khalapur. Dist. Raigad">Mahatma Education Society's Pillai HOC College of Engineering & Technology, Tal. Khalapur. Dist. Raigad</option>
              <option value="Mahatma Gandhi Missions College of Engineering, Hingoli Rd, Nanded.">Mahatma Gandhi Missions College of Engineering, Hingoli Rd, Nanded.</option>
              <option value="Mahavir Education Trust's Shah & Anchor Kutchhi Engineering College, Mumbai">Mahavir Education Trust's Shah & Anchor Kutchhi Engineering College, Mumbai</option>
              <option value="Maitraya Education Society, Nagarjuna Institute of Engineering Technology & Management, Nagpur">Maitraya Education Society, Nagarjuna Institute of Engineering Technology & Management, Nagpur</option>
              <option value="Manav School of Engineering & Technology, Gut No. 1035 Nagpur Surat Highway, NH No. 6 Tal.Vyala, Balapur, Akola, 444302">Manav School of Engineering & Technology, Gut No. 1035 Nagpur Surat Highway, NH No. 6 Tal.Vyala, Balapur, Akola, 444302</option>
              <option value="Mangaldeep College of Engineering">Mangaldeep College of Engineering</option>
              <option value="Manjara Charitable Trust's Rajiv Gandhi Institute of Technology, Mumbai">Manjara Charitable Trust's Rajiv Gandhi Institute of Technology, Mumbai</option>
              <option value="Marathwada Mitra Mandal's College of Engineering, Karvenagar, Pune">Marathwada Mitra Mandal's College of Engineering, Karvenagar, Pune</option>
              <option value="Marathwada Mitra Mandal's Institute of Technology, Lohgaon, Pune">Marathwada Mitra Mandal's Institute of Technology, Lohgaon, Pune</option>
              <option value="Marathwada Shikshan Prasarak Mandal's Shri Shivaji Institute of Engineering and Management Studies, Parbhani">Marathwada Shikshan Prasarak Mandal's Shri Shivaji Institute of Engineering and Management Studies, Parbhani</option>
              <option value="Maratha Vidya Prasarak Samaj's Karmaveer Adv. Baburao Ganpatrao Thakare College Of Engineering, Nashik">Maratha Vidya Prasarak Samaj's Karmaveer Adv. Baburao Ganpatrao Thakare College Of Engineering, Nashik</option>
              <option value="Matoshri Aasarabai Institute of Technology and Research Centre">Matoshri Aasarabai Institute of Technology and Research Centre</option>
              <option value="Matoshri College of Engineering and Research Centre, Eklahare, Nashik">Matoshri College of Engineering and Research Centre, Eklahare, Nashik</option>
              <option value="Matoshri Education Soceity, Matoshri Institute Of Technology, Dhanore, Nashik">Matoshri Education Soceity, Matoshri Institute Of Technology, Dhanore, Nashik</option>
              <option value="Matoshri Pratishan's Group of Institutions (Integrated Campus), Kupsarwadi , Nanded">Matoshri Pratishan's Group of Institutions (Integrated Campus), Kupsarwadi , Nanded</option>
              <option value="Matsyodari Shikshan Sansatha's College of Engineering and Technology, Jalna">Matsyodari Shikshan Sansatha's College of Engineering and Technology, Jalna</option>
              <option value="Mauli Group of Institutions, College of Engineering and Technology, Shegaon.">Mauli Group of Institutions, College of Engineering and Technology, Shegaon.</option>
              <option value="Maulana Mukhtar Ahmad Nadvi Technical Campus, Malegaon.">Maulana Mukhtar Ahmad Nadvi Technical Campus, Malegaon.</option>
              <option value="Metropolitan Institute of Technology & Management, Sukhalwad, Sindhudurg.">Metropolitan Institute of Technology & Management, Sukhalwad, Sindhudurg.</option>
              <option value="Modern Education Society's Wadia College of Engineering, Pune">Modern Education Society's Wadia College of Engineering, Pune</option>
              <option value="N. B. Navale Sinhgad College of Engineering, Kegaon, solapur">N. B. Navale Sinhgad College of Engineering, Kegaon, solapur</option>
              <option value="N.Y.S.S.'s Datta Meghe College of Engineering, Airoli, Navi Mumbai">N.Y.S.S.'s Datta Meghe College of Engineering, Airoli, Navi Mumbai</option>
              <option value="NBN Sinhgad Technical Institutes Campus, Pune">NBN Sinhgad Technical Institutes Campus, Pune</option>
              <option value="NKSPT Institute Of Engineering And Technology Pathikar Campus">NKSPT Institute Of Engineering And Technology Pathikar Campus</option>
              <option value="Nagaon Education Society's Gangamai College of Engineering, Nagaon, Tal Dist Dhule">Nagaon Education Society's Gangamai College of Engineering, Nagaon, Tal Dist Dhule</option>
              <option value="Nagnathappa Halge Engineering College, Parli, Beed">Nagnathappa Halge Engineering College, Parli, Beed</option>
              <option value="Nanasaheb Mahadik College of Engineering,Walwa, Sangli.">Nanasaheb Mahadik College of Engineering,Walwa, Sangli.</option>
              <option value="Navjeevan Education Society's College of Engineering, Bhandup(W), Mumbai">Navjeevan Education Society's College of Engineering, Bhandup(W), Mumbai</option>
              <option value="Navsahyadri Education Society's Group of Institutions">Navsahyadri Education Society's Group of Institutions</option>
              <option value="New Horizon Institute of Technology & Management, Thane">New Horizon Institute of Technology & Management, Thane</option>
              <option value="New Institute Of Technology,Kolhapur">New Institute Of Technology,Kolhapur</option>
              <option value="Nikam Institute of Technology(Polytechnic),Dhule">Nikam Institute of Technology(Polytechnic),Dhule</option>
              <option value="Nutan Maharashtra Vidya Prasarak Mandal, Nutan Maharashtra Institute of Engineering &Technology, Talegaon station, Pune">Nutan Maharashtra Vidya Prasarak Mandal, Nutan Maharashtra Institute of Engineering &Technology, Talegaon station, Pune</option>
              <option value="P.G. College of Engineering & Technology, Nandurbar">P.G. College of Engineering & Technology, Nandurbar</option>
              <option value="P.K. Technical Campus, Pune.">P.K. Technical Campus, Pune.</option>
              <option value="P.R. Pote Patil College of Engineering & Management, Amravati">P.R. Pote Patil College of Engineering & Management, Amravati</option>
              <option value="P.S.G.V.P. Mandal's D.N. Patel College of Engineering, Shahada, Dist. Nandurbar">P.S.G.V.P. Mandal's D.N. Patel College of Engineering, Shahada, Dist. Nandurbar</option>
              <option value="PVG's College of Engineering, Technology & Management">PVG's College of Engineering, Technology & Management</option>
              <option value="Padmashri Dr. V.B. Kolte College of Engineering, Malkapur, Buldhana">Padmashri Dr. V.B. Kolte College of Engineering, Malkapur, Buldhana</option>
              <option value="Peoples Education Society's College of Engineering, Aurangabad">Peoples Education Society's College of Engineering, Aurangabad</option>
              <option value="Phaltan Education Society's College of Engineering Thakurki Tal- Phaltan Dist-Satara">Phaltan Education Society's College of Engineering Thakurki Tal- Phaltan Dist-Satara</option>
              <option value="Pimpri Chinchwad Education Trust, Pimpri Chinchwad College of Engineering, Pune">Pimpri Chinchwad Education Trust, Pimpri Chinchwad College of Engineering, Pune</option>
              <option value="Pimpri Chinchwad Education Trust's Pimpri Chinchwad College Of Engineering And Research, Ravet">Pimpri Chinchwad Education Trust's Pimpri Chinchwad College Of Engineering And Research, Ravet</option>
              <option value="Pradnya Niketan Education Society's Nagesh Karajagi Orchid College of Engineering & Technology, Solapur">Pradnya Niketan Education Society's Nagesh Karajagi Orchid College of Engineering & Technology, Solapur</option>
              <option value="Pravara Rural College of Engineering, Loni, Pravaranagar, Ahmednagar.">Pravara Rural College of Engineering, Loni, Pravaranagar, Ahmednagar.</option>
              <option value="Pravara Rural Education Society's Sir Visvesvaraya Institute of Technology, Chincholi Dist. Nashik">Pravara Rural Education Society's Sir Visvesvaraya Institute of Technology, Chincholi Dist. Nashik</option>
              <option value="Pravin Rohidas Patil College of Engineering & Technology">Pravin Rohidas Patil College of Engineering & Technology</option>
              <option value="Priyadarshini Bhagwati College of Engineering, Harpur Nagar, Umred Road,Nagpur">Priyadarshini Bhagwati College of Engineering, Harpur Nagar, Umred Road,Nagpur</option>
              <option value="Prof Ram Meghe College of Engineering and Management, Badnera">Prof Ram Meghe College of Engineering and Management, Badnera</option>
              <option value="Prof. Ram Meghe Institute of Technology & Research, Amravati">Prof. Ram Meghe Institute of Technology & Research, Amravati</option>
              <option value="Progressive Education Society's Modern College of Engineering, Pune">Progressive Education Society's Modern College of Engineering, Pune</option>
              <option value="Pune District Education Association's College of Engineering, Manjari(Bk), Hadapsar, Pune">Pune District Education Association's College of Engineering, Manjari(Bk), Hadapsar, Pune</option>
              <option value="Pune Institute of Computer Technology">Pune Institute of Computer Technology</option>
              <option value="Pune Vidyarthi Grihas College Of Engineering & Shrikrushna S. Dhamankar Institute Of Management, Nashik">Pune Vidyarthi Grihas College Of Engineering & Shrikrushna S. Dhamankar Institute Of Management, Nashik</option>
              <option value="Puranmal Lahoti Government Institute Of Engineering And Technology, Latur">Puranmal Lahoti Government Institute Of Engineering And Technology, Latur</option>
              <option value="R. C. Patel Institute of Technology, Shirpur">R. C. Patel Institute of Technology, Shirpur</option>
              <option value="R.C. Patel College of Engineering and Polytechnic, Shirpur">R.C. Patel College of Engineering and Polytechnic, Shirpur</option>
              <option value="R.V. Parankar College of Engineering & Technology, Arvi, Dist Wardha">R.V. Parankar College of Engineering & Technology, Arvi, Dist Wardha</option>
              <option value="Rajarshi Shahu College of Engineering, Tathawade, Pune">Rajarshi Shahu College of Engineering, Tathawade, Pune</option>
              <option value="Rajendra Mane College of Engineering & Technology Ambav Deorukh">Rajendra Mane College of Engineering & Technology Ambav Deorukh</option>
              <option value="Rajgad Technical Campus">Rajgad Technical Campus</option>
              <option value="Rajiv Gandhi College of Engineering Research & Technology Chandrapur">Rajiv Gandhi College of Engineering Research & Technology Chandrapur</option>
              <option value="Rajiv Gandhi College of Engineering, At Post Karjule Hariya Tal.Parner, Dist.Ahmednagar">Rajiv Gandhi College of Engineering, At Post Karjule Hariya Tal.Parner, Dist.Ahmednagar</option>
              <option value="Rasiklal M. Dhariwal Sinhgad Technical Institutes Campus, Warje, Pune.">Rasiklal M. Dhariwal Sinhgad Technical Institutes Campus, Warje, Pune.</option>
              <option value="Rayat Shikshan Sanstha's Karmaveer Bhaurao Patil College of Engineering, Satara">Rayat Shikshan Sanstha's Karmaveer Bhaurao Patil College of Engineering, Satara</option>
              <option value="Rizvi Education Society's Rizvi College of Engineering, Bandra,Mumbai">Rizvi Education Society's Rizvi College of Engineering, Bandra,Mumbai</option>
              <option value="S.I.E.S. Graduate School of Technology, Nerul, Navi Mumbai">S.I.E.S. Graduate School of Technology, Nerul, Navi Mumbai</option>
              <option value="S.K. Patil College of Engineering, Vangali, Tal. Indapur">S.K. Patil College of Engineering, Vangali, Tal. Indapur</option>
              <option value="S.S.P.M.'s College of Engineering, Kankavli">S.S.P.M.'s College of Engineering, Kankavli</option>
              <option value="STMEI's Sandipani Technical Campus-Faculty of Engineering, Latur.">STMEI's Sandipani Technical Campus-Faculty of Engineering, Latur.</option>
              <option value="ST. Vincent Pallotti College of Engineering & Technology, Nagpur">ST. Vincent Pallotti College of Engineering & Technology, Nagpur</option>
              <option value="SVERI's College of Engineering, Pandharpur">SVERI's College of Engineering, Pandharpur</option>
              <option value="Sahakar Maharshee Shankarrao Mohite Patil Institute of Technology & Research, Akluj">Sahakar Maharshee Shankarrao Mohite Patil Institute of Technology & Research, Akluj</option>
              <option value="Sahyadri Valley College of Engineering & Technology, Rajuri, Pune.">Sahyadri Valley College of Engineering & Technology, Rajuri, Pune.</option>
              <option value="Samarth College of Engineering and Management">Samarth College of Engineering and Management</option>
              <option value="Samarth Education Trust's Arvind Gavali College Of Engineering Panwalewadi, Varye,Satara.">Samarth Education Trust's Arvind Gavali College Of Engineering Panwalewadi, Varye,Satara.</option>
              <option value="Samridhi Sarwajanik Charitable Trust, Jhulelal Institute of Technology, Nagpur">Samridhi Sarwajanik Charitable Trust, Jhulelal Institute of Technology, Nagpur</option>
              <option value="Sandip Foundation, Sandip Institute of Technology and Research Centre, Mahiravani, Nashik">Sandip Foundation, Sandip Institute of Technology and Research Centre, Mahiravani, Nashik</option>
              <option value="Sandip Foundation's, Sandip Institute of Engineering & Management, Nashik">Sandip Foundation's, Sandip Institute of Engineering & Management, Nashik</option>
              <option value="Sanghavi College of Engineering, Varvandi, Nashik.">Sanghavi College of Engineering, Varvandi, Nashik.</option>
              <option value="Sanjay Ghodawat Institute">Sanjay Ghodawat Institute</option>
              <option value="Sanjeevan Group of Institutions">Sanjeevan Group of Institutions</option>
              <option value="Sanjivani Rural Education Society's Sanjivani College of Engineering, Kopargaon">Sanjivani Rural Education Society's Sanjivani College of Engineering, Kopargaon</option>
              <option value="Sanmati Engineering College, Sawargaon Barde, Washim">Sanmati Engineering College, Sawargaon Barde, Washim</option>
              <option value="Sant Eknath College of Engineering">Sant Eknath College of Engineering</option>
              <option value="Sant Gajanan Maharaj College of Engineering, Gadhinglaj">Sant Gajanan Maharaj College of Engineering, Gadhinglaj</option>
              <option value="Sant Gadge Baba Amravati University,Amravati">Sant Gadge Baba Amravati University,Amravati</option>
              <option value="Saraswati Education Society's Saraswati College of Engineering,Kharghar Navi Mumbai">Saraswati Education Society's Saraswati College of Engineering,Kharghar Navi Mumbai</option>
              <option value="Saraswati Education Society, Yadavrao Tasgaonkar Institute of Engineering & Technology, Karjat">Saraswati Education Society, Yadavrao Tasgaonkar Institute of Engineering & Technology, Karjat</option>
              <option value="Sardar Patel College of Engineering, Andheri">Sardar Patel College of Engineering, Andheri</option>
              <option value="Shahajirao Patil Vikas Pratishthan, S.B.Patil College of Engineering, Vangali, Tal. Indapur">Shahajirao Patil Vikas Pratishthan, S.B.Patil College of Engineering, Vangali, Tal. Indapur</option>
              <option value="Shanti Education Society, A.G. Patil Institute of Technology, Soregaon, Solapur(North)">Shanti Education Society, A.G. Patil Institute of Technology, Soregaon, Solapur(North)</option>
              <option value="Sharad Institute of Technology College of Engineering, Yadrav(Ichalkaranji)">Sharad Institute of Technology College of Engineering, Yadrav(Ichalkaranji)</option>
              <option value="Shetkari Shikshan Prasarak Mandal's Mahesh Institute of Engineering and Technology , Ashti">Shetkari Shikshan Prasarak Mandal's Mahesh Institute of Engineering and Technology , Ashti</option>
              <option value="Shetkari Shikshan Mandal's Pad. Vasantraodada Patil Institute of Technology, Budhgaon, Sangli">Shetkari Shikshan Mandal's Pad. Vasantraodada Patil Institute of Technology, Budhgaon, Sangli</option>
              <option value="Shivajirao S. Jondhale College of Engineering, Dombivali,Mumbai">Shivajirao S. Jondhale College of Engineering, Dombivali,Mumbai</option>
              <option value="Shivganga Charitable Trust, Sangli Vishveshwarya Technical Campus, Faculty of Diploma Engineering, Patgaon, Miraj">Shivganga Charitable Trust, Sangli Vishveshwarya Technical Campus, Faculty of Diploma Engineering, Patgaon, Miraj</option>
              <option value="Shivnagar Vidya Prasarak Mandal's College of Engineering, Malegaon-Baramati">Shivnagar Vidya Prasarak Mandal's College of Engineering, Malegaon-Baramati</option>
              <option value="Shree Gajanan Maharaj Shikshan Prasarak Manda'l Sharadchandra Pawar College of Engineering, Dumbarwadi">Shree Gajanan Maharaj Shikshan Prasarak Manda'l Sharadchandra Pawar College of Engineering, Dumbarwadi</option>
              <option value="Shree L.R. Tiwari College of Engineering, Mira Road, Mumbai">Shree L.R. Tiwari College of Engineering, Mira Road, Mumbai</option>
              <option value="Shree Ramchandra College of Engineering, Lonikand,Pune">Shree Ramchandra College of Engineering, Lonikand,Pune</option>
              <option value="Shree Santkrupa Shikshan Sanstha, Shree Santkrupa Institute Of Engineering & Technology, Karad">Shree Santkrupa Shikshan Sanstha, Shree Santkrupa Institute Of Engineering & Technology, Karad</option>
              <option value="Shree Siddheshwar Womens College Of Engineering Solapur.">Shree Siddheshwar Womens College Of Engineering Solapur.</option>
              <option value="Shree Tuljabhavani College of Engineering, Tuljapur">Shree Tuljabhavani College of Engineering, Tuljapur</option>
              <option value="Shree Yash Pratishthan, Shreeyash College of Engineering and Technology, Aurangabad">Shree Yash Pratishthan, Shreeyash College of Engineering and Technology, Aurangabad</option>
              <option value="Shri. Ambabai Talim Sanstha's Sanjay Bhokare Group of Institutes, Miraj">Shri. Ambabai Talim Sanstha's Sanjay Bhokare Group of Institutes, Miraj</option>
              <option value="Shri. Anandrao Abitkar College of Engineering, Pal">Shri. Anandrao Abitkar College of Engineering, Pal</option>
              <option value="Shri. Balasaheb Mane Shikshan Prasarak Mandal's, Ashokrao Mane Group of Institutions">Shri. Balasaheb Mane Shikshan Prasarak Mandal's, Ashokrao Mane Group of Institutions</option>
              <option value="Shri. Jaykumar Rawal Institute of Technology, Dondaicha.">Shri. Jaykumar Rawal Institute of Technology, Dondaicha.</option>
              <option value="Shri. Sai Shikshan Sanstha, Nagpur Institute of Technology, Nagpur">Shri. Sai Shikshan Sanstha, Nagpur Institute of Technology, Nagpur</option>
              <option value="Shri. Someshwar Shikshan Prasarak Mandal, Sharadchandra Pawar College of Engineering & Technology, Someshwar Nagar">Shri. Someshwar Shikshan Prasarak Mandal, Sharadchandra Pawar College of Engineering & Technology, Someshwar Nagar</option>
              <option value="Shri Guru Gobind Singhji Institute of Engineering and Technology, Nanded">Shri Guru Gobind Singhji Institute of Engineering and Technology, Nanded</option>
              <option value="Shri Hanuman Vyayam Prasarak Mandals College of Engineering & Technology, Amravati">Shri Hanuman Vyayam Prasarak Mandals College of Engineering & Technology, Amravati</option>
              <option value="Shri Sant Gajanan Maharaj College of Engineering,Shegaon">Shri Sant Gajanan Maharaj College of Engineering,Shegaon</option>
              <option value="Shri Shivaji Education Society's College of Engineering and Technology, Akola">Shri Shivaji Education Society's College of Engineering and Technology, Akola</option>
              <option value="Shri Shivaji Vidya Prasarak Sanstha's Late Bapusaheb Shivaji Rao Deore College of Engineering,Dhule">Shri Shivaji Vidya Prasarak Sanstha's Late Bapusaheb Shivaji Rao Deore College of Engineering,Dhule</option>
              <option value="Shri Swami Samarth Institute of Management and Technology, Malwadi-Bota">Shri Swami Samarth Institute of Management and Technology, Malwadi-Bota</option>
              <option value="Shri Vile Parle Kelavani Mandal's College of Engineering, Shirpur">Shri Vile Parle Kelavani Mandal's College of Engineering, Shirpur</option>
              <option value="Shri Vile Parle Kelvani Mandal's Dwarkadas J. Sanghvi College of Engineering, Vile Parle,Mumbai">Shri Vile Parle Kelvani Mandal's Dwarkadas J. Sanghvi College of Engineering, Vile Parle,Mumbai</option>
              <option value="Shriram Gram Vikas Shikshan Sanstha, Vilasrao Deshmukh College of Engineering and Technology, Nagpur">Shriram Gram Vikas Shikshan Sanstha, Vilasrao Deshmukh College of Engineering and Technology, Nagpur</option>
              <option value="Shriram Institute Of Engineering & Technology, (Poly), Paniv">Shriram Institute Of Engineering & Technology, (Poly), Paniv</option>
              <option value="Siddhant College of Engineering, A/p Sudumbare, Tal.Maval, Dist-Pune">Siddhant College of Engineering, A/p Sudumbare, Tal.Maval, Dist-Pune</option>
              <option value="Siddhivinayak Technical Campus, School of Engineering & Research Technology, Shirasgon, Nile">Siddhivinayak Technical Campus, School of Engineering & Research Technology, Shirasgon, Nile</option>
              <option value="Sinhgad Academy of Engineering, Kondhwa (BK) Kondhwa-Saswad Road, Pune">Sinhgad Academy of Engineering, Kondhwa (BK) Kondhwa-Saswad Road, Pune</option>
              <option value="Sinhgad College of Engineering, Vadgaon (BK), Pune">Sinhgad College of Engineering, Vadgaon (BK), Pune</option>
              <option value="Sinhgad Institute of Technology">Sinhgad Institute of Technology</option>
              <option value="Sinhgad Technical Education Society, Sinhgad Institute of Technology and Science, Narhe (Ambegaon)">Sinhgad Technical Education Society, Sinhgad Institute of Technology and Science, Narhe (Ambegaon)</option>
              <option value="Sinhgad Technical Education Society's Smt. Kashibai Navale College of Engineering,Vadgaon,Pune">Sinhgad Technical Education Society's Smt. Kashibai Navale College of Engineering,Vadgaon,Pune</option>
              <option value="Sipna Shikshan Prasarak Mandal College of Engineering & Technology, Amravati">Sipna Shikshan Prasarak Mandal College of Engineering & Technology, Amravati</option>
              <option value="Sir Shantilal Badjate Charitable Trust's S. B. Jain Institute of technology, Management & Research, Nagpur">Sir Shantilal Badjate Charitable Trust's S. B. Jain Institute of technology, Management & Research, Nagpur</option>
              <option value="Smt. Indira Gandhi College of Engineering, Navi Mumbai">Smt. Indira Gandhi College of Engineering, Navi Mumbai</option>
              <option value="Smt. Sharchchandrika Suresh Patil Institute Of Technology (Engineering & Polytechnic), Chopda">Smt. Sharchchandrika Suresh Patil Institute Of Technology (Engineering & Polytechnic), Chopda</option>
              <option value="SNJB's Late Sau. Kantabai Bhavarlalji Jain College of Engineering, (Jain Gurukul), Neminagar,Chandwad,(Nashik)">SNJB's Late Sau. Kantabai Bhavarlalji Jain College of Engineering, (Jain Gurukul), Neminagar,Chandwad,(Nashik)</option>
              <option value="Somayya Institute of Technology, Chandrapur">Somayya Institute of Technology, Chandrapur</option>
              <option value="St. Francis Institute of Technology,Borivali, Mumbai">St. Francis Institute of Technology,Borivali, Mumbai</option>
              <option value="Suman Ramesh Tulsiani Technical Campus Faculty of Engineering, Kamshet,Pune.">Suman Ramesh Tulsiani Technical Campus Faculty of Engineering, Kamshet,Pune.</option>
              <option value="Suryodaya College of Engineering & Technology, Nagpur">Suryodaya College of Engineering & Technology, Nagpur</option>
              <option value="Swami Vivekanand Institute Of Technology, Solapur">Swami Vivekanand Institute Of Technology, Solapur</option>
              <option value="Swami Vivekananda Shikshan Sanstha, Dr. Bapuji Salunkhe Institute Of Engineering & Technology,Kolhapur">Swami Vivekananda Shikshan Sanstha, Dr. Bapuji Salunkhe Institute Of Engineering & Technology,Kolhapur</option>
              <option value="Swaminarayan Siddhanta Institute Of Technology, Nagpur">Swaminarayan Siddhanta Institute Of Technology, Nagpur</option>
              <option value="T.M.E. Society's J.T.Mahajan College of Engineering, Faizpur">T.M.E. Society's J.T.Mahajan College of Engineering, Faizpur</option>
              <option value="TSSM's Bhivarabai Sawant College of Engineering and Research, Narhe, Pune">TSSM's Bhivarabai Sawant College of Engineering and Research, Narhe, Pune</option>
              <option value="TSSMS's Pd. Vasantdada Patil Institute of Technology, Bavdhan, Pune">TSSMS's Pd. Vasantdada Patil Institute of Technology, Bavdhan, Pune</option>
              <option value="Takshashila Institute of Engineering & Technology, Darapur, Amravati">Takshashila Institute of Engineering & Technology, Darapur, Amravati</option>
              <option value="Tatyasaheb Kore Institute of Engineering and Technology, Warananagar">Tatyasaheb Kore Institute of Engineering and Technology, Warananagar</option>
              <option value="Terna Engineering College, Nerul, Navi Mumbai">Terna Engineering College, Nerul, Navi Mumbai</option>
              <option value="Terna Public Charitable Trust's College of Engineering, Osmanabad">Terna Public Charitable Trust's College of Engineering, Osmanabad</option>
              <option value="Thadomal Shahani Engineering College, Bandra, Mumbai">Thadomal Shahani Engineering College, Bandra, Mumbai</option>
              <option value="Thakur College of Engineering and Technology, Kandivali, Mumbai">Thakur College of Engineering and Technology, Kandivali, Mumbai</option>
              <option value="Thakur Shree DPS College of Engineering & Management">Thakur Shree DPS College of Engineering & Management</option>
              <option value="Thakur Shyamnarayan Engineering College, Mumbai">Thakur Shyamnarayan Engineering College, Mumbai</option>
              <option value="Trimurti Shikshan Prasarak Mandal, Trimurti Institute Of Technology, Paladhi Bk, Jalgaon">Trimurti Shikshan Prasarak Mandal, Trimurti Institute Of Technology, Paladhi Bk, Jalgaon</option>
              <option value="Tulsiramji Gaikwad Patil College of Engineering & Technology, Nagpur">Tulsiramji Gaikwad Patil College of Engineering & Technology, Nagpur</option>
              <option value="Universal College of Engineering & Research, Sasewadi">Universal College of Engineering & Research, Sasewadi</option>
              <option value="University Department of Chemical Technology, Aurangabad">University Department of Chemical Technology, Aurangabad</option>
              <option value="University Institute of Chemical Technology, North Maharashtra University, Jalgaon">University Institute of Chemical Technology, North Maharashtra University, Jalgaon</option>
              <option value="Usha Mittal Institute of Technology SNDT Women's University, Mumbai">Usha Mittal Institute of Technology SNDT Women's University, Mumbai</option>
              <option value="VPM's Maharshi Parshuram College of Engineering, Velneshwar, Ratnagiri.">VPM's Maharshi Parshuram College of Engineering, Velneshwar, Ratnagiri.</option>
              <option value="Vamanrao Ithape College Of Engineering And Management">Vamanrao Ithape College Of Engineering And Management</option>
              <option value="Vardhaman Education & Welfare Society, Ahinsa Institute of Technology, Post. Dondaicha, Dhule">Vardhaman Education & Welfare Society, Ahinsa Institute of Technology, Post. Dondaicha, Dhule</option>
              <option value="Vasantdada Patil Pratishthan's College Of Engineering and Visual Arts, Sion, Mumbai">Vasantdada Patil Pratishthan's College Of Engineering and Visual Arts, Sion, Mumbai</option>
              <option value="Veermata Jijabai Technological Institute(VJTI), Matunga, Mumbai">Veermata Jijabai Technological Institute(VJTI), Matunga, Mumbai</option>
              <option value="Vidya Niketan College of Engineering, Bota Sangamner">Vidya Niketan College of Engineering, Bota Sangamner</option>
              <option value="Vidya Niketan Institute of Engineering & Technology, Lakhewadi">Vidya Niketan Institute of Engineering & Technology, Lakhewadi</option>
              <option value="Vidya Prasarak Mandal's College of Engineering, Thane">Vidya Prasarak Mandal's College of Engineering, Thane</option>
              <option value="Vidya Prasarini Sabha's College of Engineering & Technology, Lonavala">Vidya Prasarini Sabha's College of Engineering & Technology, Lonavala</option>
              <option value="Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering & Technology, Baramati Dist.Pune">Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering & Technology, Baramati Dist.Pune</option>
              <option value="Vidya Vikas Pratishthan Institute of Engineering and Technology, Solapur">Vidya Vikas Pratishthan Institute of Engineering and Technology, Solapur</option>
              <option value="Vidyalankar Institute of Technology,Wadala, Mumbai">Vidyalankar Institute of Technology,Wadala, Mumbai</option>
              <option value="Vidyavardhini's College of Engineering and Technology, Vasai">Vidyavardhini's College of Engineering and Technology, Vasai</option>
              <option value="Vighnaharata Trust's Shivajirao S. Jondhale College of Engineering & Technology, Shahapur, Asangaon, Dist Thane">Vighnaharata Trust's Shivajirao S. Jondhale College of Engineering & Technology, Shahapur, Asangaon, Dist Thane</option>
              <option value="Vilasrao Deshmukh Foundation Group of Institutions, Latur">Vilasrao Deshmukh Foundation Group of Institutions, Latur</option>
              <option value="Vision Buldhana Educational & Welfare Society's Pankaj Laddhad Institute of Technology & Management Studies, Yelgaon">Vision Buldhana Educational & Welfare Society's Pankaj Laddhad Institute of Technology & Management Studies, Yelgaon</option>
              <option value="Vishnu Waman Thakur Charitable Trust's VIVA Institute of Technology, Virar">Vishnu Waman Thakur Charitable Trust's VIVA Institute of Technology, Virar</option>
              <option value="Vishwabharati Academy's College of Engineering, Ahmednagar">Vishwabharati Academy's College of Engineering, Ahmednagar</option>
              <option value="Vishwaniketan's Institute of Management Entrepreneurship and Engineering Technology(i MEET), Khalapur Dist Raigad">Vishwaniketan's Institute of Management Entrepreneurship and Engineering Technology(i MEET), Khalapur Dist Raigad</option>
              <option value="Vishwatmak Jangli Maharaj Ashram Trust (Kokamthan), Atma Malik Institute Of Technology & Research">Vishwatmak Jangli Maharaj Ashram Trust (Kokamthan), Atma Malik Institute Of Technology & Research</option>
              <option value="Vishweshwarayya Institute Of Engineering And Technology, Almala, Tq. Ausa, Dist. Latur">Vishweshwarayya Institute Of Engineering And Technology, Almala, Tq. Ausa, Dist. Latur</option>
              <option value="Vivekanand Education Society's Institute of Technology, Chembur, Mumbai">Vivekanand Education Society's Institute of Technology, Chembur, Mumbai</option>
              <option value="Wainganga College of Engineering and Management, Dongargaon, Nagpur">Wainganga College of Engineering and Management, Dongargaon, Nagpur</option>
              <option value="Walchand College of Engineering, Sangli">Walchand College of Engineering, Sangli</option>
              <option value="Walchand Institute of Technology, Solapur">Walchand Institute of Technology, Solapur</option>
              <option value="Watumull Institute of Engineering & Technology, Ulhasnagar">Watumull Institute of Engineering & Technology, Ulhasnagar</option>
              <option value="Xavier Institute Of Engineering C/O Xavier Technical Institute,Mahim,Mumbai">Xavier Institute Of Engineering C/O Xavier Technical Institute,Mahim,Mumbai</option>
              <option value="Yadavrao Tasgaonkar College of Engineering & Management">Yadavrao Tasgaonkar College of Engineering & Management</option>
              <option value="Yashoda Mahadeo Kakade College of Engineering, Talegaon">Yashoda Mahadeo Kakade College of Engineering, Talegaon</option>
              <option value="Yashoda Technical Campus, Wadhe, Satara.">Yashoda Technical Campus, Wadhe, Satara.</option>
              <option value="Yashwantrao Bhonsale Institute Of Technology">Yashwantrao Bhonsale Institute Of Technology</option>
              <option value="Yeshwantrao Chavan College of Engineering,Wanadongri, Nagpur">Yeshwantrao Chavan College of Engineering,Wanadongri, Nagpur</option>
              <option value="Zeal College of Engineering & Research, Induri, Pune (Off Campus-Induri)">Zeal College of Engineering & Research, Induri, Pune (Off Campus-Induri)</option>
              <option value="Zeal Education Society's Zeal College of Engineering & Reserch, Narhe, Pune">Zeal Education Society's Zeal College of Engineering & Reserch, Narhe, Pune</option>

            </select>
            <input type="number" name="currentYear" placeholder={data.user.currentyear} onChange={handleChange} />
            <input type="email" name="email" placeholder={data.user.email} onChange={handleChange} />
            <button type="submit">edit</button>
          </form>
        ) : (
          <p>Loading...</p>
        )}

      </div>

      <div className="updateForm" style={{ display: post }}>
        <form onSubmit={handlePostSubmit}>
          {/* <img src={previewImg || defaultImg} alt="preview" /> */}
          <input
            id="post"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          <input
            type="text"
            name="post_title"
            placeholder="Enter post title"
            required
            onChange={handlePostChange}
          />

          <input
            type="number"
            name="post_price"
            placeholder="Enter pricing"
            required
            onChange={handlePostChange}
          />

          <textarea
            name="post_description"
            placeholder="Enter post description"
            rows="4"
            required
            onChange={handlePostChange}

          />

          <select name="category" required onChange={handlePostChange}
          >
            <option value="">Select category</option>
            <option value="book">Book</option>
            <option value="tool">Tool</option>
            <option value="pg">PG / Accommodation</option>
            <option value="notes">Notes</option>
            <option value="other">Other</option>

          </select>


          <button type="submit">Create Post</button>
        </form>
      </div>


      <hr />
      <div className="post-container">
        {postData && postData.length > 0 ? (
          postData.map(post => (
            <div key={post.id} className={`post-card ${post.isInactive ? "inactive" : ""}`}>
              <img src={`http://localhost:5000${post.imglink}`} alt="post" />
              <h2>{post.post_title}</h2>
              <h2>{post.post_price}</h2>

              <p>{post.post_description}</p>
              <div className="action-btns">

                {/* <button className="action-btn secondary" onClick={() => handleActive(post.id)}>inactive</button> */}
                <button className="action-btn secondary" onClick={() => handleDelete(post.id)}>delete</button>
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
                    src={`http://localhost:5000${selectedPost.profileimglink}`}
                    alt=""
                  />
                  <div>
                    <h3>{selectedPost.username}</h3>
                    <p>{selectedPost.college}</p>
                  </div>
                </div> */}

            <div className="modal-post">
            <img src={`http://localhost:5000${selectedPost.imglink}`} alt="post"  />
            <h2>{selectedPost.post_title}</h2>
            <h2>₹{selectedPost.post_price}</h2>
            <p>{selectedPost.post_description}</p>
            </div>
          </div>
        </div>
      )}




  </>
}

export default Profile;