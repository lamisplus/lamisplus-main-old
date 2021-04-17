import axios from "axios";
import { url as baseUrl } from "../api";
import * as ACTION_TYPES from "./types";
import { toast } from "react-toastify";


export const fetchAll = (onSuccess, onError) => dispatch => {
    axios
        .get(`${baseUrl}patients/`)
        .then(response => {
            console.log(response.data);
            if(onSuccess){
                onSuccess();
            }
            dispatch({
                type: ACTION_TYPES.PATIENTS_FETCH_ALL,
                payload: response.data
            });
            onSuccess();
        })

        .catch(error => {
                if(onError){
                    onError();
                }
                dispatch({
                    type: ACTION_TYPES.PATIENTS_ERROR,
                    payload: error
                })
                onError();
            }

        );
};


export const fetchById = (id, onSuccess, onError) => dispatch => {
        axios
            .get(`${baseUrl}users/roles/${id}`)
            .then(response => {
                dispatch({
                    type: ACTION_TYPES.USERS_FETCH_BY_ID,
                    payload: response.data
                });
                onSuccess && onSuccess();
            })
            .catch(error =>

                {
                    dispatch({
                        type: ACTION_TYPES.USER_ERROR,
                        payload: error
                    })
                    onError && onError();
                    console.log(error.response);
                }

            );
};

export const fetchPatientUser = (id, onSuccess, onError) => dispatch => {
    axios
        .get(`${baseUrl}application_user_patient/users/${id}`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.PATIENT_BY_USER_ID,
                payload: response.data
            });
            onSuccess && onSuccess();
        })
        .catch(error =>

            {
                dispatch({
                    type: ACTION_TYPES.USER_ERROR,
                    payload: error
                })
               onError && onError();
            }

        );
};

export const create = (data, onSuccess, onError) => dispatch => {
    console.log(data)
    axios
        .post(`${baseUrl}application_user_patient/`, data)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.PATIENTS_CREATE,
                payload: response.data
            });
            toast.success("Patient assigned successfully!");
            console.log(response)
            if(onSuccess){
                onSuccess();
            }
        })
        .catch(error => {
                if(onError){
                    onError();
                }
            }

        );
};


// export const create = (data, onSuccess, onError) => dispatch => {
//     axios
//         .post(`${baseUrl}application_user_patient/`, data)
//         .then(response => {
//             dispatch({
//                 type: ACTION_TYPES.PATIENTS_CREATE,
//                 payload: response.data
//             })
//             onSuccess()
//         })
//         .catch(error => {
//             dispatch({
//                 type: ACTION_TYPES.PATIENTS_ERROR,
//                 payload: 'Something went wrong, please try again'
//             })
//         })
// }

export const update = (data, id, onSuccess, onError) => dispatch => {
    console.log(`${baseUrl}application_user_patient/${id}`);
    axios
        .put(`${baseUrl}application_user_patient/${id}`, data)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.PATIENTS_UPDATE,
                payload: response.data
            });
            onSuccess()
            toast.success("Patient record was updated successfully!");
        })
        .catch(error => {
            dispatch({
                type: ACTION_TYPES.PATIENTS_ERROR,
                payload:error.response.data
            });
            console.log(error.response.data)
            onError()
            if(error.response.data.apierror.message===null || error.response.data.apierror.message===""){
                toast.error("Something went wrong");
            }else{
                toast.error(error.response.data.apierror.message);
            }
        });
};


export const Delete = (id) => dispatch => {
    console.log(`${baseUrl}patients/${id}`);
    axios
        .delete(`${baseUrl}patients/${id}`)
        .then(response => {

            dispatch({
                type: ACTION_TYPES.PATIENT_DELETE,
                payload: id
            });

            toast.success("Patient record was deleted successfully!");
        })
        .catch(error => {
            dispatch({
                type: ACTION_TYPES.PATIENTS_ERROR,
                payload:error.response.data
            });

            if(error.response.data.apierror.message===null || error.response.data.apierror.message===""){
                toast.error("Something went wrong");
            }else{
                toast.error(error.response.data.apierror.message);
            }

        });
};

