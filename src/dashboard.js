import React, { useEffect, useState } from "react";
import MapPage from "./components/map";
import "./styles/dasboard.css";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import Select from "react-select";
import data from "./data";
import { Temperature, Humidity } from "react-environment-chart";
import Loader from "react-js-loader";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "./components/axios";
import { removeToken } from "./components/TokenService";

function Dashboard() {
  const [center, setCenter] = useState([0, -0]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState();
  const [city, setCity] = useState(null);
  const [forcast, setForeCast] = useState({});
  const [smFont, setSmFont] = useState(false);
  const [zoom, setZoom] = useState(4);
  const [radius, setRadius] = useState(20);
  const [icon, setIcon] = useState(null);
  const [userIcon, setUserIcon] = useState(null);
  const [background, setBackground] = useState("");
  const [clearIcon, setClearIcon] = useState(null);
  const [userClearIcon, setUserClearIcon] = useState(null);
  const [userForecast, setUserForecast] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [colorScale, setColorScale] = useState("temp");
  let navigate = useNavigate();

  let weatherAppUserInfo = JSON.parse(
    window.localStorage.getItem("weatherAppUserInfo")
  );

  // let accessToken = JSON.parse(window.localStorage.getItem("weatherAppToken"));

  axiosPrivateInstance.get("/private", () => {
    alert("private to go");
  });

  const getUserForecast = (country, city) => {
    console.log(country, city);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=a49864adbaac49db5c8db9431b97702b&units=metric`
      )
      .then((resp) => {
        const data = resp.data;

        console.log(data);

        let dt;
        function upper_am_pm(dt) {
          return dt < 12 ? "AM" : "PM";
        }

        console.log(upper_am_pm(dt));
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const sec = data.dt * 1000;
        console.log(sec);
        let newDate = new Date(sec);
        let month = new Date(sec).toLocaleString("default", {
          month: "long",
        });
        let date = newDate.getDate();
        let day = newDate.getDay();
        let year = newDate.getFullYear();
        let hour = newDate.getHours();
        let minutes = newDate.getMinutes();
        let seconds = newDate.getSeconds();

        // function countWords(str) {
        //   return str.length;
        // }

        // if (countWords(data.name) > 3) {
        //   setSmFont(true);
        // } else {
        //   setSmFont(false);
        // }

        if (hour <= 9) hour = "0" + hour;
        if (minutes < 10) minutes = "0" + minutes;
        const postTime = hour + ":" + minutes;

        // console.log(sec);
        // console.log(year);
        // console.log(times);
        // console.log("month ", month);
        // console.log(postTime);
        // console.log(days[day]);
        // console.log(date);
        // console.log(upper_am_pm(hour));

        setUserForecast({
          humidity: data.main.humidity,
          temp: data.main.temp,
          city: data.name,
          country_code: data.sys.country,
          lon: data.coord.lon,
          lat: data.coord.lat,
          date: days[day] + " " + month + " " + date,
          time: postTime + upper_am_pm(hour) + "-",
          desc: data.weather.map((val, i, arr) => val.description),
          wind: data.wind.speed,
          cloud: data.clouds.all,
        });

        setUserIcon(data.weather.map((val, i, arr) => val.icon));

        // set aplication backgroung
        const wether_id = data.weather.map((val, i, arr) => val.id);
        const wetherId = wether_id[0];
        // const wetherId = 800;

        if (wetherId === 800) {
          setUserClearIcon("113");
        }
        sendForecastRreq(city);
      })
      .catch((err) => console.log(err));
  };

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

        let randCountry =
          resp.data[Math.floor(Math.random() * resp.data.length)];
        console.log("randCountry ", randCountry.name.official);
        weatherAppUserInfo &&
          getUserForecast(weatherAppUserInfo?.country, randCountry.name.common);
        setCity(randCountry.name.common);
      })
      .catch((err) => console.log(err));
  }, []);

  const sendForecastRreq = (city) => {
    if (!city) {
      alert("City field is empty, please fill");
      return;
    } else {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a49864adbaac49db5c8db9431b97702b&units=metric`
        )
        .then((resp) => {
          const data = resp.data;

          console.log(data);

          let dt;
          function upper_am_pm(dt) {
            return dt < 12 ? "AM" : "PM";
          }

          console.log(upper_am_pm(dt));
          const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];

          const sec = data.dt * 1000;
          console.log(sec);
          let newDate = new Date(sec);
          let month = new Date(sec).toLocaleString("default", {
            month: "long",
          });
          let date = newDate.getDate();
          let day = newDate.getDay();
          let year = newDate.getFullYear();
          let hour = newDate.getHours();
          let minutes = newDate.getMinutes();
          let seconds = newDate.getSeconds();

          function countWords(str) {
            return str.length;
          }

          if (countWords(data.name) > 3) {
            setSmFont(true);
          } else {
            setSmFont(false);
          }

          if (hour <= 9) hour = "0" + hour;
          if (minutes < 10) minutes = "0" + minutes;
          const postTime = hour + ":" + minutes;

          // console.log(sec);
          // console.log(year);
          // console.log(times);
          // console.log("month ", month);
          // console.log(postTime);
          // console.log(days[day]);
          // console.log(date);
          // console.log(upper_am_pm(hour));

          setForeCast({
            humidity: data.main.humidity,
            temp: data.main.temp,
            city: data.name,
            country_code: data.sys.country,
            lon: data.coord.lon,
            lat: data.coord.lat,
            date: days[day] + " " + month + " " + date,
            time: postTime + upper_am_pm(hour) + "-",
            desc: data.weather.map((val, i, arr) => val.description),
            wind: data.wind.speed,
            cloud: data.clouds.all,
          });

          // check_text(data.weather.map((val, i, arr) => val.description))

          setCenter([data.coord.lat, data.coord.lon]);

          setIcon(data.weather.map((val, i, arr) => val.icon));

          // set aplication backgroung
          const wether_id = data.weather.map((val, i, arr) => val.id);
          const wetherId = wether_id[0];

          if (
            wetherId === 200 ||
            wetherId === 201 ||
            wetherId === 202 ||
            wetherId === 210 ||
            wetherId === 211 ||
            wetherId === 212 ||
            wetherId === 221 ||
            wetherId === 230 ||
            wetherId === 231 ||
            wetherId === 232
          ) {
            setBackground("thunderstorm");
            setClearIcon(null);
          } else if (
            wetherId === 300 ||
            wetherId === 301 ||
            wetherId === 302 ||
            wetherId === 310 ||
            wetherId === 311 ||
            wetherId === 312 ||
            wetherId === 313 ||
            wetherId === 314 ||
            wetherId === 321
          ) {
            setBackground("drizzle");
            setClearIcon(null);
          } else if (
            wetherId === 500 ||
            wetherId === 501 ||
            wetherId === 502 ||
            wetherId === 503 ||
            wetherId === 504 ||
            wetherId === 511 ||
            wetherId === 520 ||
            wetherId === 521 ||
            wetherId === 522 ||
            wetherId === 531
          ) {
            setBackground("rain");
            setClearIcon(null);
          } else if (
            wetherId === 600 ||
            wetherId === 601 ||
            wetherId === 602 ||
            wetherId === 611 ||
            wetherId === 612 ||
            wetherId === 613 ||
            wetherId === 615 ||
            wetherId === 616 ||
            wetherId === 620 ||
            wetherId === 621 ||
            wetherId === 622
          ) {
            setBackground("snow");
            setClearIcon(null);
          } else if (
            wetherId === 701 ||
            wetherId === 711 ||
            wetherId === 721 ||
            wetherId === 731 ||
            wetherId === 741 ||
            wetherId === 751 ||
            wetherId === 761 ||
            wetherId === 762 ||
            wetherId === 771 ||
            wetherId === 781
          ) {
            setBackground("atmosphere");
          } else if (wetherId === 800) {
            setBackground("clear");
            setClearIcon("113");
          } else if (wetherId > 800) {
            setBackground("cloudy");
            setClearIcon(null);
          }

          if (
            countries.filter((e) => {
              return (
                e.common_name.toLowerCase() === city.toLowerCase() ||
                e.official_name.toLowerCase() === city.toLowerCase()
              );
            }).length > 0
          ) {
            setZoom(4);
            setRadius(40);
          } else {
            setZoom(12);
            setRadius(20);
          }

          // set app background image
          if (data.cod === 1000) {
            alert("clear day");
          }

          console.log((225 / (100 - 0)) * (forcast.temp - 0));

          console.log({
            humidity: data.main.humidity,
            temp: data.main.temp,
            city: data.name,
            country_code: data.sys.country,
            lon: data.coord.lon,
            lat: data.coord.lat,
            date: days[day] + " " + month + " " + date,
            time: postTime + upper_am_pm(hour) + "-",
            desc: data.weather.map((val, i, arr) => val.description),
            wind: data.wind.speed,
            cloud: data.clouds.all,
          });

          setIsLoading(false);
          console.log(userForecast);
        })
        .catch((err) => console.log(err));
    }
  };

  const logOut = () => {
    removeToken();
    navigate("/", { replace: true });
  };

  return (
    <div>
      {isLoading ? (
        <>
          <div className="loader_box">
            <div className="loader_inner">
              <div className="loader">
                <Loader type="spinner-circle" bgColor={"#6495ed"} size={400} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="wether_app"
            style={{ backgroundImage: `url(./assets/img/${background}.jpg)` }}
          >
            <div className="container">
              <h1 className="app_name">
                Weather Forecast Application{" "}
                <button className="logout_btn" onClick={() => logOut()}>
                  logout
                </button>
              </h1>
              <div className="greet">
                Welcome:{" "}
                <b style={{ textTransform: "capitalize" }}>
                  &nbsp;{weatherAppUserInfo && weatherAppUserInfo.fullname}
                </b>
              </div>
              <div className="greet">My Location:</div>
              <div className="wether_output wether_output1">
                <h1 className="temp temp1" style={{}}>
                  {userForecast && userForecast.city}
                </h1>
                &nbsp; &nbsp;
                <div className="city_time">
                  <div className="flex_box" style={{ marginTop: "0em" }}>
                    <div className="flex_inner">
                      <b className="name name1">
                        {userForecast && userForecast.temp}&#176;
                      </b>
                      <small style={{ marginLaft: "-1em" }}>temp</small>
                    </div>
                    &nbsp; &nbsp;
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <b className="name name1">
                        {userForecast && userForecast.humidity}%
                      </b>
                      <small style={{ marginLaft: "-1em" }}>humidity</small>
                    </div>
                    &nbsp; &nbsp;
                    <div className="wether">
                      <img
                        src={
                          userClearIcon === null
                            ? `http://openweathermap.org/img/wn/${userIcon}.png`
                            : `./assets/img/${userClearIcon}.png`
                        }
                        className="icon"
                        alt="icon"
                        width={50}
                        height={50}
                        style={{ marginBottom: "-3px" }}
                      />
                      <center>
                        <small>{userForecast && userForecast.desc}</small>
                      </center>
                    </div>
                  </div>
                  &nbsp; &nbsp;
                  <small>
                    <span className="time">
                      {userForecast && userForecast.time}
                    </span>
                    <span className="date">
                      {userForecast && userForecast.date}
                    </span>
                  </small>
                </div>
                &nbsp; &nbsp;
              </div>
              <br />
              <div className="map_box">
                <MapPage
                  zoom={zoom}
                  center={center}
                  radius={radius}
                  humidity={forcast ? forcast.humidity : "0"}
                  temperature={forcast ? forcast.temp : "0"}
                  country={forcast ? forcast.city : ""}
                />
              </div>
            </div>
            <div className="panel">
              <form className="locationInput">
                <input
                  type="text"
                  className="search"
                  placeholder="Enter Country Or City"
                  onChange={(event) => setCity(event.target.value)}
                />
                <button
                  className="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    sendForecastRreq(city);
                    console.log(city);
                  }}
                >
                  <AiOutlineSearch size={30} />
                </button>
              </form>

              <ul className="details">
                <h4>Wether Details</h4>
                <li>
                  <span>Cloudy</span>
                  <span className="cloud">{forcast && forcast.cloud}%</span>
                </li>
                <li>
                  <span>Temperature</span>
                  <span className="cloud">{forcast && forcast.temp}&#176;</span>
                </li>
                <li>
                  <span>Humidity</span>
                  <span className="cloud">{forcast && forcast.humidity}%</span>
                </li>
                <li>
                  <span>Wind</span>
                  <span className="wind">{forcast && forcast.wind}km/h</span>
                </li>
              </ul>

              <ul
                className="wether_output wether_output2"
                onClick={() => console.log(forcast)}
              >
                <h1 className="temp">{forcast && forcast.temp}&#176;</h1>
                <div className="city_time">
                  <h1 className={`name ${smFont && "small"}`}>
                    {forcast && forcast.city + " "}
                    <small className="country_code">
                      {forcast && forcast.country_code + " "}
                    </small>
                    <br />
                  </h1>
                  {smFont && <br />}
                  <small>
                    <span className="time">{forcast && forcast.time}</span>
                    <span className="date">{forcast && forcast.date}</span>
                  </small>
                </div>
                <div className="wether">
                  <img
                    src={
                      clearIcon === null
                        ? `http://openweathermap.org/img/wn/${icon}.png`
                        : `./assets/img/${clearIcon}.png`
                    }
                    // src={`./assets/img/${icon}.png`}

                    className="icon"
                    alt="icon"
                    width={smFont ? 40 : 50}
                    height={smFont ? 40 : 50}
                  />
                  <span className={`condition ${smFont && "smally"}`}>
                    {forcast && forcast.desc}
                  </span>
                </div>
              </ul>
              <ul className="details" style={{ marginTop: "-3em" }}>
                <div className="flex_row flex_row1">
                  <h4>Humidity & Temperature Colour Scale</h4>
                  <div className="flex_row">
                    <button
                      className={`color_scale_btn ${
                        colorScale === "temp" ? "active" : ""
                      }`}
                      onClick={() => setColorScale("temp")}
                    >
                      Temperature
                    </button>
                    <button
                      className={`color_scale_btn ${
                        colorScale === "humidity" ? "active" : ""
                      }`}
                      onClick={() => setColorScale("humidity")}
                    >
                      Humidity
                    </button>
                  </div>
                </div>

                <div>
                  {forcast && colorScale === "temp" ? (
                    <Temperature
                      value={forcast && forcast.temp}
                      height={330}
                      tips={["Freezing", "Cold", "Cosy", "Hot"]}
                    />
                  ) : (
                    colorScale === "humidity" && (
                      <Humidity
                        
                        value={forcast && forcast.humidity}
                        height={150}
                        tips={["Dry", "Mild", "Wet"]}
                      />
                    )
                  )}
                </div>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
