import Navbar from './navbar.jsx'
import Footer from './footer.jsx'
import {Link} from "react-router-dom";
import header1 from './assets/header1.png';
import "./styles/body.css"

function Home(){

    return <>
    <Navbar/>
    <div id="bodycontainer">

       <header className="hero">
        <img src={header1} alt="Students sharing books on campus"/>
        
        <div className="hero-text">
            <h1>Campus Share</h1>
            <p className="tagline">Share More. Pay Less. Campus Life Made Simple.</p>
            <p className="subtitle">Find rooms, share books, connect with campus community</p>
            
            <div className="hero-cta">
            <a className="cta-button cta-primary">Find Items</a>
            <a  className="cta-button cta-secondary">Share Items</a>
            <a  className="cta-button cta-primary">Find Rooms</a>            
            </div>
        </div>
        </header>
       


        <div id="about">
            <h1>Built by Students. Powered by Community.</h1>
        <div className="about-content">
            {/* <img src="./public/about.png" alt="" /> */}
            <p>
                “ Campus_Share is a student-first platform designed to make campus life smarter and more affordable. We enable students to share books, tools, and resources, discover verified PG accommodations, and connect with trusted peers — all within a single, secure ecosystem built for Indian campuses.  ”          <br/><br/>
            <span className="signature">– The CampusShare Team</span>
            </p>
        </div>
        </div>


        <div id="features">
            <h1>“Campus Essentials”</h1>
            <div className="features-content">
                <div className="feature-card">
                    <img src="./public/resource sharing.png" alt="sharing images" />
                    <h3>Resource Sharing</h3>
                    <ul>
                        <li>Share books, tools, lab kits, and daily-use items</li>
                        <li>Reduce costs and avoid unnecessary purchases</li>
                        <li>Borrow from verified campus users nearby</li>
                    </ul>
                </div>

                <div className="feature-card">
                    <img src="./public/pg.png" alt="sharing images" />
                    <h3>PG & Accommodation Discovery</h3>
                    <ul>
                        <li>Discover student-friendly PGs around colleges</li>
                        <li>View real photos, rent details, and location</li>
                        <li>Connect directly with owners or existing tenants</li>
                    </ul>
                </div>

                <div className="feature-card">
                    <img src="./public/community driven.png" alt="sharing images" />
                    <h3>Community-Driven Ecosystem</h3>
                    <ul>
                        <li>Encourages reuse and sustainability</li>
                        <li>Strengthens student collaboration</li>
                        <li>Builds a culture of sharing, not spending</li>
                    </ul>
                </div>
            </div>
            <Link to="/login" >Start Sharing Now</Link>            

        </div>

 <section className="value">
  <h2>How CampusShare Helps Students</h2>
  <p className="value-subtitle">Everything you need, all in one trusted campus community</p>

  <div className="value-grid">
    <div className="value-card">
      <div className="value-icon-wrap">
        <span className="value-icon">₹</span>
      </div>
      <h3>Save Money</h3>
      <p>Buy, sell, or rent items at student-friendly prices instead of paying full retail</p>
    </div>

    <div className="value-card">
      <div className="value-icon-wrap">
        <span className="value-icon">♻</span>
      </div>
      <h3>Reduce Waste</h3>
      <p>Give pre-loved books, furniture, and gadgets a second life instead of discarding them</p>
    </div>

    <div className="value-card">
      <div className="value-icon-wrap">
        <span className="value-icon">🏠</span>
      </div>
      <h3>Find Housing</h3>
      <p>Discover verified PG accommodations and flatmates near your campus, hassle-free</p>
    </div>

    <div className="value-card">
      <div className="value-icon-wrap">
        <span className="value-icon">👥</span>
      </div>
      <h3>Trusted Network</h3>
      <p>Connect only with verified students from your own college or university</p>
    </div>

    <div className="value-card">
      <div className="value-icon-wrap">
        <span className="value-icon">📚</span>
      </div>
      <h3>Academic Resources</h3>
      <p>Share notes, textbooks, and study materials with peers in your program</p>
    </div>

    <div className="value-card">
      <div className="value-icon-wrap">
        <span className="value-icon">⚡</span>
      </div>
      <h3>Quick & Easy</h3>
      <p>List an item or find what you need in minutes with our simple, intuitive platform</p>
    </div>

    <div className="value-card">
      <div className="value-icon-wrap">
        <span className="value-icon">🔒</span>
      </div>
      <h3>Safe Transactions</h3>
      <p>Meet on campus, chat securely in-app, and deal only with verified student profiles</p>
    </div>

    <div className="value-card">
      <div className="value-icon-wrap">
        <span className="value-icon">📍</span>
      </div>
      <h3>Hyperlocal Listings</h3>
      <p>See only what's available near your campus, so pickup is always convenient</p>
    </div>
  </div>
</section>

        <Footer/>


        </div>
</>
}

export default Home;
