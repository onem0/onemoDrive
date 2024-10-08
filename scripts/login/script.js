import axios from "axios";
import Cookies from "js-cookie";
import { changeMessage } from "@/scripts/accountManagement/sendNotification.js";

export function login(email, password) {
  const url = "https://login.onemo.dev/login";

  return axios
    .post(url, {
      email: email,
      password: password,
    })
    .then((response) => {
      if (response.data.content === "Wrong Email or password.") {
        changeMessage(
          true,
          "Wrong Credentials",
          "Check your email and password"
        );
        return false;
      } else {
        Cookies.set("token", response.data.token, { expires: 7 });
        return true;
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
      return response.data;
    })
    .catch((error) => {
      return null;
    });
}
