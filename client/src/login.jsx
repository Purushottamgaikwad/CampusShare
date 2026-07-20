import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import Navbar from './navbar.jsx'
import Footer from './footer.jsx'
import './styles/login.css'
function Login(){
    const navigate = useNavigate();
    const [ formData, setformData] = useState({
        email:"",
        password:""
    });
    
    const handleChange=(e)=>{
        setformData({
        ...formData,
       [e.target.name ]: e.target.value
        });
    }


    const handleSubmit= async(e)=>{
        e.preventDefault();
        if(formData.email==""  ||  formData.password==""){
            return 
        }

        const res = await fetch("http://localhost:5000/api/auth/login",{
            method: 'POST',
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            })
        });
        const data = await res.json();
       
        if(res.ok){
            alert(data.userdata.username);
            navigate('/dashboard');
        }else{
             alert(data.error);
        }

    }


    return <>
    <Navbar/>
    <div className='signup'>
        <div className="signup-content">
            <form onSubmit={handleSubmit} >

                <h2>Login</h2>
                <input type="email" name="email" placeholder="Enter Your Email" onChange={handleChange}/>
                <input type="password" name="password" placeholder="Enter password"  onChange={handleChange}/>
            
                <button type="submit">Login</button>
                <Link>forget password</Link>
            </form>
        </div>
  
    </div>  
    <Footer/>
    </>
}


export default Login;