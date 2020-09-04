import axios from 'axios'
import { url as baseUrl } from '../api/index'
import * as ACTION_TYPES from './types'

/**
 * @Actions
 * Encounter CRUD OPERATIONS
 * returns API response from server
 * =================================
 * @method GET => fetchAll() get all forms
 * @method GET => fetchById() get form by Id: params{formId}{programCode} || query {null}
 * create()
 * update()
 * Delete()
 */

export const fetchAll = (onSuccess, onError) => dispatch => {
  axios
    .get(`${baseUrl}forms`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FORM_FETCH_ALL,
        payload: response.data
      })
      onSuccess()
    })
    .catch(error => {
      onError()
      dispatch({
        type: ACTION_TYPES.FORM_ERROR,
        payload: 'Something went wrong, please try again'
      })
      
    })
}

export const fetchAllPrograms = (onSuccess, onError) => dispatch => {
  axios
    .get(`${baseUrl}programs`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.PROGRAM_FETCH_ALL,
        payload: response.data
      })
      onSuccess()
    })
    .catch(error => {
      onError()
      dispatch({
        type: ACTION_TYPES.FORM_ERROR,
        payload: 'Something went wrong, please try again'
      })
      
    })
}

export const fetchById = (id, onSuccess, onError) => dispatch => {
  dispatch({
    type: ACTION_TYPES.FORM_FETCH_BY_ID,
    payload: {}
  })

  axios
    .get(`${baseUrl}forms/${id}/formCode`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FORM_FETCH_BY_ID,
        payload: response.data
      })
      onSuccess()
    })
    .catch(error => {
      onError()
      dispatch({
        type: ACTION_TYPES.FORM_ERROR,
        payload: 'Error loading form, something went wrong. Please try again'
      })
//onError(error.response)
    })
}

export const create = (data, onSuccess, onError) => dispatch => {
  axios
    .post(`${baseUrl}forms/`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FORM_CREATE,
        payload: response.data
      })
      onSuccess()
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.FORM_ERROR,
        payload: 'Something went wrong, please try again'
      })
      onError(error.response)
    })
}

export const update = (id, data) => dispatch => {
  axios
    .put(`${baseUrl}forms/${id}`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FORM_UPDATE,
        payload: response.data
      })
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.FORM_ERROR,
        payload: 'Something went wrong, please try again'
      })
    })
}

export const saveEncounter = (data, onSuccess, onError) => dispatch => {
  axios
    .post(`${baseUrl}encounters/`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FORM_SAVE_ENCOUNTER,
        payload: response.data
      })
      onSuccess()
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.FORM_ERROR,
        payload: 'Something went wrong, please try again'
      })
      onError(error.response)
    })
}

export const updateFormData = (id, data, onSuccess, onError) => dispatch => {
  axios
    .put(`${baseUrl}form-data/${id}`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.UPDATE_FORM_DATA,
        payload: response.data
      })
      onSuccess()
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.FORM_ERROR,
        payload: 'Something went wrong, please try again'
      })
      onError(error.response)
    })
}