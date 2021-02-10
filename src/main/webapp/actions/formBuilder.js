import axios from 'axios'
import {url} from '../api'
import * as FORMTYPES from './types'
import {toast} from 'react-toastify';

export const fetchService = (onSuccess) => dispatch => {
    axios.get(`${url}programs`)
        .then(response => {
            console.log(response)
            dispatch({
                type: FORMTYPES.FORMTYPES_FETCH_SERVICES,
                payload: response.data
            })
            onSuccess()
        })
        .catch(error => {
            console.log(error)
            dispatch({
                type: FORMTYPES.FORMTYPES_ERROR,
                payload: 'Something went wrong'

            })
        })
}

export const fetchAllForms = (onSuccess) => dispatch => {
    axios.get(`${url}forms`)
        .then(response => {
            console.log(response)
            dispatch({
                type:FORMTYPES.FORMTYPES_FETCH_ALL_FORMS,
                payload: response.data
            })
            onSuccess()
        })
        .catch(error => {
            // onError()
            dispatch({
                type: FORMTYPES.FORMTYPES_ERROR,
                payload: 'Something went wrong, please try again'
            })

        })
}


export const createForm = (data, onSuccess, onError) => dispatch => {
    console.log(data)
    axios
        .post(`${url}forms/`, data)
        .then(response => {
            dispatch({
                type: FORMTYPES.FORMTYPES_CREATE_FORM,
                payload: response.data
            });
            toast.success("Form was saved successfully!");
            console.log(response)
        })
        .catch(error => {
            dispatch({
                type: FORMTYPES.FORMTYPES_ERROR,
                payload: "Something went wrong"
            });
        });
};

export const updateForm = (id, data) => dispatch => {
    axios
        .put(`${url}forms/${id}`, data)
        .then(response => {
            dispatch({
                type: FORMTYPES.FORMTYPES_UPDATE,
                payload: response.data
            });
            toast.success("Form was saved successfully!");
            console.log(response)
        })
        .catch(error => {
            dispatch({
                type: FORMTYPES.FORMTYPES_ERROR,
                payload: 'Something went wrong, please try again'
            })
        })
}


export const fetchById = (programId, onSuccess, onError) => dispatch => {
    axios.get(`${url}programs/${programId}/forms`)
        .then(response => {
            console.log(response)
            dispatch({
                type: FORMTYPES.FORMTYPES_FETCH_BY_ID,
                payload: response.data
            })
            if(onSuccess){
                onSuccess()
            }
        })
        .catch(error => {
            console.log(error)
            dispatch({
                type: FORMTYPES.FORMTYPES_ERROR,
                payload: 'Something went wrong'

            })
            if(onError){
                onError()
            }
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


export const Delete = (id) => dispatch => {
    console.log(`${url}forms/${id}`);
    axios
        .delete(`${url}forms/${id}`)
        .then(response => {

            dispatch({
                type: FORMTYPES.FORMTYPES_DELETE,
                payload: id
            });
            toast.success("Form was deleted successfully!");
        })
        .catch(error => {
            dispatch({
                type: FORMTYPES.FORMTYPES_ERROR,
                payload:error.response.data
            });
            if(error.response.data.apierror.message===null || error.response.data.apierror.message===""){
                toast.error("Something went wrong");
            }else{
                toast.error(error.response.data.apierror.message);
            }
        });
};
