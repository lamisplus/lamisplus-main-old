import axios from "axios";
import { url as baseUrl } from "../api";
import * as ACTION_TYPES from "./types";

/**
 * ========================================================================
 * @Actions
 * Encounter CRUD OPERATIONS
 * returns API response from server => payload: response || error
 * @method GET => fetchAll() -> get all encounters: params {serviceName}{formName} || query {null}
 * @method GET => fetchById()  -> get visit/encounter by Id: params {id} || query {null}
 * @method POST => create() -> create a new visit/encounter: params {formData} || query {null}
 * @method PUT => update() -> Update an existing visit: params {id}{data} || query {null}
 * @method DELETE => Delete() -> remove a record: params {id} || query {null}
 * ==========================================================================
 */

export const fetchAll = (serviceName, formName) => dispatch => {
  axios
    .get(`${baseUrl}encounters/${serviceName}/${formName}`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.ENCOUNTER_FETCH_ALL,
        payload: response.data
      });
    })
    .catch(error =>
      dispatch({
        type: ACTION_TYPES.ENCOUNTER_ERROR,
        payload: "Something went wrong, please try again"
      })
    );
};

export const fetchById = id => dispatch => {
  axios
    .get(`${baseUrl}encounters/${id}`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.ENCOUNTER_FETCH_BY_ID,
        payload: response.data
      });
    })
    .catch(error =>
      dispatch({
        type: ACTION_TYPES.ENCOUNTER_ERROR,
        payload: "Something went wrong, please try again"
      })
    );
};

export const create = (data, onSuccess, onError )=> dispatch => {
  axios
    .post(`${baseUrl}encounters/`, data)
    .then(response => {
      onSuccess()
      dispatch({
        type: ACTION_TYPES.ENCOUNTER_CREATE,
        payload: response.data
      });
    })
    .catch(error => {
      if(onError){
        onError(error.response);
      }
      dispatch({
        type: ACTION_TYPES.ENCOUNTER_ERROR,
        payload: 'Something went wrong, please try again'
      })
      // 
    })
}