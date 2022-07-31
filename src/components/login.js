import axios from "axios";
import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import "../styles/login.css";

function Login() {
  const [active, setActive] = useState("signUp");
  const [country, setCountry] = useState([]);
  const [countries, setCountries] = useState();
  let [info, setInfo] = useState({
    fullname: "",
    email: "",
    password: "",
    region: "",
  });

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

  return (
    <div className="login_box">
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
                onChange={(val) => setCountry(val.value)}
              />

              <input
                type="text"
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
              />
              <span></span>
              <input
                type="submit"
                className="btn"
                onClick={(val) => console.log(info)}
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
                onClick={() => console.log(info)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
