import axios from 'axios'
import { url as baseUrl } from '../api'
import * as ACTION_TYPES from './types'

/**
 * @Actions
 * Encounter CRUD OPERATIONS
 * returns API response from server
 * =================================
 * fetchAll( onSuccess, onError)
 */



export const fetchAll = (onSuccess, onError) => dispatch => {
  axios
    .get(`${baseUrl}drugs/`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.MEDICATION_FETCH,
        payload: response.data
      })
      onSuccess()
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.MEDICATION_ERROR,
        payload: 'Something went wrong, please try again'
      })
      onError(error.response)
    })
}


export const fetchAllRegimen = (onSuccess, onError) => dispatch => {
    axios
        .get(`${baseUrl}regimens/`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.REGIMEN_FETCH,
                payload: response.data
            })
            onSuccess()
        })
        .catch(error => {
            dispatch({
                type: ACTION_TYPES.MEDICATION_ERROR,
                payload: 'Something went wrong, please try again'
            })
            onError(error.response)
        })
}


export const fetchAllRegimenLine = (onSuccess, onError) => dispatch => {
    axios
        .get(`${baseUrl}regimen-lines`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.REGIMEN_LINE_FETCH,
                payload: response.data
            })
            onSuccess()
        })
        .catch(error => {
            dispatch({
                type: ACTION_TYPES.MEDICATION_ERROR,
                payload: 'Something went wrong, please try again'
            })
            onError(error.response)
        })
}
