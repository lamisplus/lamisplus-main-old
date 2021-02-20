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
export const register = (data, onSuccess, onError) => (dispatch) => {
  axios
    .post(`${baseUrl}register/`, data)
    .then((response) => {
      try {
        dispatch({
          type: ACTION_TYPES.REGISTER_SUCCESS,
          payload: response.data,
        });
        onSuccess && onSuccess();
      } catch (err) {
        onError();
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

export const fetchUsers = (onSuccess, onError) => (dispatch) => {
  axios
    .get(`${baseUrl}users/`)
    .then((response) => {
      if (onSuccess) {
        onSuccess();
      }
      dispatch({
        type: ACTION_TYPES.FETCH_USERS,
        payload: response.data,
      });
      onSuccess();
    })
    .catch((error) => {
      if (onError) {
        onError();
      }
      dispatch({
        type: ACTION_TYPES.USER_ROLE_UPDATE,
        payload: "Something went wrong, please try again",
      });
      onError();
    });
};


export const updateUserRole = (id, data, onSuccess, onError) => (dispatch) => {
  axios
    .post(`${baseUrl}users/${id}/roles`, data)
    .then((response) => {
      try {
        dispatch({
          type: ACTION_TYPES.USER_ROLE_UPDATE,
          payload: response.data,
        });
        onSuccess && onSuccess();
      } catch (err) {
        onError();
        console.log(err);
      }
    })
    .catch((error) => {
      dispatch({
        type: ACTION_TYPES.USERS_ERROR,
        payload: "Something went wrong, please try again",
      });
      console.log(error);
    });
};

export const fetchMe = (onSuccess, onError) => (dispatch) => {
    axios
        .get(`${baseUrl}account/`)
        .then((response) => {
            if (onSuccess) {
                onSuccess();
            }
            dispatch({
                type: ACTION_TYPES.FETCH_ME,
                payload: response.data,
            });
        })
        .catch((error) => {
            if (onError) {
                onError();
            }
            dispatch({
                type: ACTION_TYPES.FETCH_ME,
                payload: null,
            });
        });
};
