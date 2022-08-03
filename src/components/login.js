import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import "../styles/login.css";
import axiosInstance from "./axios";
import {browserHistory} from 'react-router'

function Login() {
  const [active, setActive] = useState("signUp");
  const [country, setCountry] = useState([]);
  const [countries, setCountries] = useState();
  let [info, setInfo] = useState({
    fullname: "",
    email: "",
    password: "",
    password2: "",
    region: "",
  });
  
  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((resp) => {
        // console.log(resp.data.map((val, index, arr) => val.latlng ))
        setCountries(
          resp.data.map((val, index, arr) => ({
            value: val.name.common,
            label: val.name.common,
            code: val.cca2,
            common_name: val.name.common,
            official_name: val.name.official,
            center: val.latlng,
          }))
        );
      })
      .catch((err) => console.log(err));
  }, []);

  // loging users in

  const signIn = () => {
    if (info.email === "") {
      alert("Please input email");
    } else if (info.password === "") {
      alert("Please input password");
    } else {
      axiosInstance
        .post("/login", {
          email: info.email,
          password: info.password,
        })
        .then((resp) => {
          console.log(resp);
          if (resp.data.accessToken) {
            const refreshTokenResp = resp.data.refreshToken;
            const accessTokenResp = resp.data.accessToken;
            const weatherAppUserInfoResp = resp.data;
            // console.log("weatherAppUserInfoResp ",weatherAppUserInfoResp);
            
            window.localStorage.setItem(
              "weatherAppUserInfo",
              JSON.stringify({
                fullname: weatherAppUserInfoResp.user.fullname,
                country: weatherAppUserInfoResp.user.country,
                email: weatherAppUserInfoResp.user.email,
              })
            );
            window.localStorage.setItem(
              "weatherAppToken",
              JSON.stringify(accessTokenResp)
            );
            window.localStorage.setItem(
              "weatherAppRefreshToken",
              JSON.stringify(refreshTokenResp)
            );
        
            let weatherAppUserInfo = JSON.parse(
              window.localStorage.getItem("weatherAppUserInfo")
            );
             let refreshToken = JSON.parse(
              window.localStorage.getItem("weatherAppRefreshToken")
            );
            let accessToken = JSON.parse(
              window.localStorage.getItem("weatherAppToken")
            );
            console.log("accessToken on sign in ", accessToken);
            console.log("refreshToken on sign in ", refreshToken);
            console.log("weatherAppUserInfo ", weatherAppUserInfo);
            navigate("dashboard",{replace:true});
         
          } else {
            // console.log(resp);
            if(resp.data.code === 111){
              alert(info.email + " is not registered with us")
            }else if(resp.data.code === 113){
              alert("password is incorrect")
            }
          }
        })
        .catch((err) => {
          console.log("err ",err);
          // if(err.response.data.code=== 113){
          //   alert("password is incorrect")
          // }
        });
    }
  };

  // registering new users

  const signUp = () => {
    if (info.name === "") {
      alert("Please input fullname");
    } else if (info.email === "") {
      alert("Please input email");
    } else if (info.password === "") {
      alert("Please input password");
    } else if (info.password.length < 6) {
      alert("Password should be greater than five characters");
    } else if (info.password2 === "") {
      alert("Please re enter password");
    } else if (info.password2 != info.password) {
      alert("Password should match");
    } else {
      axiosInstance
        .post("/signup", {
          email: info.email,
          password: info.password,
          country: info.region,
          fullname: info.fullname,
        })
        .then((resp) => {
          if (resp.data.accessToken) {
            // console.log(resp);
            const refreshTokenResp = resp.data.refreshToken;
            const accessTokenResp = resp.data.accessToken;
            const weatherAppUserInfoResp = resp.data.data;
          
            window.localStorage.setItem(
              "weatherAppUserInfo",
              JSON.stringify({
                fullname: weatherAppUserInfoResp.fullname,
                country: weatherAppUserInfoResp.country,
                email: weatherAppUserInfoResp.email,
              })
            );
            window.localStorage.setItem(
              "weatherAppToken",
              JSON.stringify(accessTokenResp)
            );
            window.localStorage.setItem(
              "weatherAppRefreshToken",
              JSON.stringify(refreshTokenResp)
            );
            
            let weatherAppUserInfo = JSON.parse(
              window.localStorage.getItem("weatherAppUserInfo")
            );
            let refreshToken = JSON.parse(
              window.localStorage.getItem("weatherAppRefreshToken")
            );
            let accessToken = JSON.parse(
              window.localStorage.getItem("weatherAppToken")
            );
            console.log("accessToken on sign in ", accessToken);
            console.log("refreshToken on sign in ", refreshToken);
            console.log("accessToken on sign up ", accessToken);
            console.log("weatherAppUserInfo ", weatherAppUserInfo);
            navigate("dashboard",{replace:true});
          } else {
            // console.log(resp);
            if(resp.data.code == 112){
              alert(info.email+" already exist")
            }
          }
        })
        .catch((err) => {
          console.log("err",err.response.data.errors[0].msg);
          alert(err.response.data.errors[0].msg)
        });
    }
  };
  return (
    <div className="login_box">
      <form>
        <div>
          <div className="pill_box">
            <div
              className={`pill ${active == "signUp" ? "active" : ""}`}
              onClick={() => {
                info = {
                  fullname: "",
                  email: "",
                  password: "",
                  region: "",
                };
                setActive("signUp");
              }}
            >
              Sign Up
            </div>
            <div
              className={`pill ${active == "signIn" ? "active" : ""}`}
              onClick={() => {
                info = {
                  fullname: "",
                  email: "",
                  password: "",
                  region: "",
                };
                setActive("signIn");
              }}
            >
              Sign In
            </div>
          </div>
          <div className="sign_box">
            {active == "signUp" ? (
              <div className="sign_up_box">
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="Enter fullname (e.g jhon doe)"
                  onChange={(val) => (info.fullname = val.target.value)}
                />
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="Enter email (e.g jhondoe@gmail.com)"
                  onChange={(val) => (info.email = val.target.value)}
                />
                <ReactSelect
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Select Country"
                  isClearable={true}
                  isSearchable={true}
                  name="countries"
                  options={countries}
                  onChange={(val) => (info.region = val.common_name)}
                />

                <input
                  type="password"
                  required
                  className="input"
                  placeholder="Enter password"
                  onChange={(val) => (info.password = val.target.value)}
                />
                <input
                  type="password"
                  required
                  className="input"
                  placeholder="Re Enter password"
                  onChange={(val) => (info.password2 = val.target.value)}
                />
                <span></span>
                <input
                  type="submit"
                  className="btn"
                  onClick={(val) => {
                    val.preventDefault();
                    signUp();
                  }}
                />
              </div>
            ) : (
              <div className="sign_up_box">
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="Enter email"
                  onChange={(val) => (info.email = val.target.value)}
                />
                <input
                  type="password"
                  required
                  className="input"
                  placeholder="Enter Password"
                  onChange={(val) => (info.password = val.target.value)}
                />

                <span></span>
                <input
                  type="submit"
                  className="btn"
                  onClick={(val) => {
                    val.preventDefault();
                    signIn();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
