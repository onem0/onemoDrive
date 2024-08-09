import axios from "axios";
import Cookies from "js-cookie";

export function login(email, password) {
  const url = "https://login.onemo.dev/login";

  axios
    .post(url, {
      email: email,
      password: password,
    })
    .then((response) => {
      if (response.data.content === "Wrong Email or password.") {
        alert("Wrong email or password");
      } else {
        Cookies.set("token", response.data.token, { expires: 7 });
        window.location = "/";
      }
    })
    .catch((error) => {});
}

export function checkToken() {
  const url = "https://login.onemo.dev/getUsername";
  const token = Cookies.get("token");

  return axios
    .post(url, { token: token })
    .then((response) => {
      if (response.data.content) {
        return response.data;
      }
    })
    .catch((error) => {
      return null;
    });
}
