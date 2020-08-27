import axios from "axios";
import { url as baseUrl } from "../api";
import * as ACTION_TYPES from "./types";

/**
 * @Actions
 *  User Operations
 * returns API response from server => payload: response || error
 * =================================
 * @method POST => register() -> register a new User

 */
export const register = (data) => (dispatch) => {
  axios
    .post(`${baseUrl}register/`, data)
    .then((response) => {
      try {
        dispatch({
          type: ACTION_TYPES.REGISTER_SUCCESS,
          payload: response.data,
        });
      } catch (err) {
        console.log(err);
      }
    })
    .catch((error) => {
      dispatch({
        type: ACTION_TYPES.REGISTER_FAILURE,
        payload: "Something went wrong, please try again",
      });
      console.log(error);
    });
};


export const fetchUsers = () => dispatch => {
  axios
    .get(`${baseUrl}users/`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FETCH_USERS,
        payload: response.data
      });
    })
    .catch(error =>
      dispatch({
        type: ACTION_TYPES.USERS_ERROR,
        payload: "Something went wrong, please try again"
      })
    );
};
