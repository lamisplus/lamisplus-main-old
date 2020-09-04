import axios from 'axios'

import {url as baseUrl, url} from '../api'

import * as FORMTYPES from './types'

export const fetchService = () => dispatch => {
    axios.get(`${url}programs`)
        .then(response => {
            console.log(response)
            dispatch({
                type: FORMTYPES.FORMTYPES_FETCH_SERVICES,
                payload: response.data
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({
                type: FORMTYPES.FORMTYPES_ERROR,
                payload: 'Something went wrong'

            })
        })
}

export const createForm = (data) => dispatch => {
    console.log(data)
    axios
        .post(`${url}forms/`, data)
        .then(response => {
            dispatch({
                type: FORMTYPES.FORMTYPES_CREATE_FORM,
                payload: response.data
            })
            console.log(response)
        })
        //onSuccess()
        .catch(error => {
            //onError()
            dispatch({
                type: FORMTYPES.FORMTYPES_ERROR,
                payload: 'please try again'
            })
            //onError(error.response)
        })
}

export const updateForm = (id, data) => dispatch => {
    axios
        .put(`${url}forms/${id}`, data)
        .then(response => {
            dispatch({
                type: FORMTYPES.FORMTYPES_UPDATE,
                payload: response.data
            })
        })
        .catch(error => {
            dispatch({
                type: FORMTYPES.FORMTYPES_ERROR,
                payload: 'Something went wrong, please try again'
            })
        })
}

// export const fetchById = (id, onSuccess, onError) => dispatch => {
//     dispatch({
//         type:FORMTYPES.FORMTYPES_FETCH_BY_ID,
//         payload: {}
//     })
//
//     axios
//         .get(`${url}forms/${id}/formCode`)
//         .then(response => {
//             dispatch({
//                 type:FORMTYPES.FORMTYPES_FETCH_BY_ID,
//                 payload: response.data
//             })
//             onSuccess()
//         })
//         .catch(error => {
//             //onError()
//             dispatch({
//                 type: FORMTYPES.FORMTYPES_ERROR,
//                 payload: 'Error loading form, something went wrong. Please try again'
//             })
//    // onError(error.response)
//         })
// }

export const fetchById = (programId) => dispatch => {
    axios.get(`${url}programs/${programId}/forms`)
        .then(response => {
            console.log(response)
            dispatch({
                type: FORMTYPES.FORMTYPES_FETCH_BY_ID,
                payload: response.data
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({
                type: FORMTYPES.FORMTYPES_ERROR,
                payload: 'Something went wrong'

            })
        })
}
export const fetchAll = (onSuccess, onError) => dispatch => {
    axios
        .get(`${url}forms`)
        .then(response => {
            dispatch({
                type: FORMTYPES.FORMTYPES_FETCH_ALL,
                payload: response.data
            })
            onSuccess()
        })
        .catch(error => {
            //onError()
            dispatch({
                type:  FORMTYPES.FORMTYPES_ERROR,
                payload: 'Something went wrong, please try again'
            })

        })
}

export const fetchForms = () => dispatch => {
    axios.get(`${url}programs/1/forms`)
        .then(response => {
            console.log(response)
            dispatch({
                type: FORMTYPES.FORMTYPES_FETCH_ALL,
                payload: response.data
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({
                type: FORMTYPES.FORMTYPES_ERROR,
                payload: 'Something went wrong'

            })
        })
}