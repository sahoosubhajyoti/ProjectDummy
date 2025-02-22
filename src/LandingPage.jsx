import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./styles/LandingPage.css"; // Import custom CSS

import { GoArrowRight } from "react-icons/go";

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  return (
    <div className="container">
      <main className="main-content">
        <div className="content">
          <div className="content-header">
            <h1 className="title">EXAMONLINE</h1>
            <div style={{ "height": "300px", "width": "300px" }}>

            </div>
            <pre className="subtitle">
              A Comprehensive AI-driven Solution for<br />Test Administration & <br />Subjective
              Answer Assessment Automation
            </pre>
          </div>
          <div className="button-group">
            <button className="button" onClick={() => navigate("/login")}>
              LOGIN / NEW USER SIGNUP <GoArrowRight size={40} />
            </button>
            <button className="button" onClick={() => window.open("https://www.ivaplus.co.in/about-us/","_blank")} >ABOUT US <GoArrowRight size={40} /></button>
            <button className="button" onClick={() => window.open("https://www.ivaplus.co.in/contact-us/", "_blank")}>CONTACT SALES <GoArrowRight size={40} /></button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
