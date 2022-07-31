import React from "react";
import Intro from "./components/intro";
import Login from "./components/login";
import "./styles/home.css";

function Home() {
  return (
    <>
    <div className="fullscreen-bg"> 
      <video src="./assets/bg.mp4" autoPlay muted loop type="video/mp4" className="fullscreen-bg__video"/> 
    </div>
    <div className="home">
        <div className="home_box">
          <Intro />
          <Login />
        </div>
      </div>
      
    </>
  );
}

export default Home;
