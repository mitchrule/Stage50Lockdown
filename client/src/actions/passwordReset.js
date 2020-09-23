import axios from "axios";

import { GET_ERRORS } from "./types";

export const requestRecovery = (userData) => (dispatch) => {
  axios
    .post("/api/recovery/requestRecovery", userData)
    .then((res) => {
      console.log("Recovery email sent to ", userData.email);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const changePassword = (userData, history) => (dispatch) => {
  axios
    .post("/api/recovery/recoverPassword", userData)
    .then((res) => {
      console.log("Password Changed....");
      history.push("/signin");
    })
    .catch((err) => {
      console.log("Change Password failed. Errors:", err);
      dispatch({
        type: GET_ERRORS,
        payload: err,
      });
    });
};
