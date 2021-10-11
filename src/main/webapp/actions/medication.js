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

