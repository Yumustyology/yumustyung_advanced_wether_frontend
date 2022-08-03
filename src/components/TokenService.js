export const getLocalAccessToken = () => {
  let token = JSON.parse(
    JSON.stringify(window.localStorage.getItem("weatherAppToken"))
  );
  console.log("accessToken on service page ", token);

  return token;
};

export const getLocalRefreshToken = () => {
  let refreshToken = JSON.parse(
    JSON.stringify(window.localStorage.getItem("weatherAppRefreshToken"))
  );
  console.log("refresh token on service page ", refreshToken);

  return refreshToken;
};

export const updateLocalAccessToken = (accessToken) => {
  window.localStorage.setItem("weatherAppToken", accessToken);
};

export const removeToken = () => {
    window.localStorage.removeItem("weatherAppToken");
    window.localStorage.removeItem("weatherAppUserInfo");
    window.localStorage.removeItem("weatherAppRefreshToken");
  };

