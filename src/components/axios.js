import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getLocalAccessToken, getLocalRefreshToken, removeToken, updateLocalAccessToken } from "./TokenService";



// unprotected third party request
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  // baseURL: "https://weather-advanced-app.herokuapp.com/",
});
// private request
export const axiosPrivateInstance = axios.create({
  baseURL: "http://localhost:5000",
  // baseURL: "https://weather-advanced-app.herokuapp.com/",
  headers: {
    "Content-Type": "application/json",
  },
});
   

axiosPrivateInstance.interceptors.request.use(
 (config) => {
  const token = getLocalAccessToken()
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// with response data, do the the following
axiosPrivateInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    // let navigate = useNavigate();
    const originalConfig = err.config;
    if (err.response) {
      // check if access token expired
      const refreshToken = JSON.parse(
        window.localStorage.getItem("weatherAppRefreshToken")
      );
      if (err.response.status === 403 && !originalConfig._retry) {
        // handle infinite loop
        originalConfig._retry = true;
        try {
          const rs = await axiosInstance.post("/refreshToken", {
            refreshToken: refreshToken,
          });
          console.log("refresh token on if access token expired ",refreshToken)
          console.log("rs ", rs);
          const { accessToken } = rs.data;
          console.log("new access token", accessToken);
          updateLocalAccessToken(accessToken)
          return axiosPrivateInstance(originalConfig);
        } catch (error) {
          // refresh token invalid or expired
          if(error.response.status === 403){
            console.log("refresh token expired");
            // log user out
            removeToken()           
            window.location.replace("http://localhost:3000/");
          }
          return Promise.reject(error);
        }
      } else if(err.response.status === 401){
        if(!getLocalRefreshToken() || !getLocalAccessToken()){
          console.log("you dont have one of the required credentials to remain logged in");
          // log user out
          removeToken()         
            window.location.replace("http://localhost:3000/");
        }
        console.log("err of unauthorized ", err);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
