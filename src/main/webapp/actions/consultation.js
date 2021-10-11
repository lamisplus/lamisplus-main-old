import axios from 'axios'
import { url as baseUrl } from '../api'
import * as ACTION_TYPES from './types'

/**
 * @Actions
 * Encounter CRUD OPERATIONS
 * returns API response from server
 * =================================
 * create(data, onSuccess, onError)
 */



export const create = (data, onSuccess, onError) => dispatch => {
  axios
    .post(`${baseUrl}encounters/`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CONSULTATION_CREATE,
        payload: response.data
      })
      onSuccess()
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.CONSULTATION_ERROR,
        payload: 'Something went wrong, please try again'
      })
      onError(error.response)
    })
}

