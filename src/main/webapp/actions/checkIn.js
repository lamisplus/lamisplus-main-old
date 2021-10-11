import axios from "axios";
import { url } from "../api";
import * as ACTION_TYPES from "./types";

/**
 * @Actions
 *  CheckIn CRUD OPERATIONS
 * returns API response from server => payload: response || error
 * =================================
 * @method GET => fetchAll() -> get all visits: params {null} | query: {null}
 * @method GET => fetchById()  -> get visit by Id: params {id} | query: {null}
 * @method POST => create() -> create a new visit: params {formData} | query : {null}
 * @method PUT => update() -> Update an existing visit: params {id}{data} | query: {null}
 * @method DELETE => Delete() -> remove a record: params {id} | query: {null}
 */

export const fetchAll = () => dispatch => {
  axios
    .get(`${url}visits/`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CHECKIN_FETCH_ALL,
        payload: response.data
      });
    })
    .catch(error =>
      dispatch({
        type: ACTION_TYPES.CHECKIN_ERROR,
        payload: "Something went wrong, please try again"
      })
    );
};

export const fetchById = id => dispatch => {
  axios
    .get(`${url}visits/${id}`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CHECKIN_FETCH_BY_ID,
        payload: response.data
      });
    })
    .catch(error =>
      dispatch({
        type: ACTION_TYPES.CHECKIN_ERROR,
        payload: "Something went wrong, please try again"
      })
    );
};

export const create = (data, onSuccess, onError) => dispatch => {
  axios
    .post(`${url}visits/`, data)
    .then(response => {
      try{
      dispatch({
        type: ACTION_TYPES.CHECKIN_CREATE,
        payload: response.data
      });
    }catch(err){
      console.log(err)
    }
      onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.CHECKIN_ERROR,
        payload: 'Something went wrong, please try again'
      })
      console.log('in failed')
      onError(error.response)
    })
}



export const update = (id, data) => dispatch => {
  axios
    .put(`${url}visits/${id}`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CHECKIN_UPDATE,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.CHECKIN_ERROR,
        payload: "Something went wrong, please try again"
      });
    });
};

export const Delete = (id, onSuccess) => dispatch => {
  axios
    .delete(`${url}visits/${id}`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CHECKIN_DELETE,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch({
        types: ACTION_TYPES.CHECKIN_ERROR,
        payload: "Something went wrong, please try again"
      });
    });
};
