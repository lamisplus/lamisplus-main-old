import axios from 'axios'
import { url as baseUrl } from '../api'
import * as ACTION_TYPES from './types'

/**
 * @Actions
 * Encounter CRUD OPERATIONS
 * returns API response from server
 * =================================
 * fetchAll()
 * fetchById()
 * create()
 * update()
 * Delete()
 */


export const create = (data, onSuccess, onError) => dispatch => {
  axios
    .post(`${baseUrl}encounters/`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.ENCOUNTER_CREATE,
        payload: response.data
      })
      dispatch({
        type: ACTION_TYPES.ENCOUNTER_CREATE,
        payload: response.data
      })
      onSuccess()
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ENCOUNTER_ERROR,
        payload: 'Something went wrong, please try again'
      })
      onError(error.response)
    })
}
