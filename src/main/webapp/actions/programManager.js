import axios from "axios";
import { url } from "api";
import {APPOINTMENT_FORM, GENERAL_SERVICE} from "api/codes";
import * as ACTION_TYPES from "./types";


export const fetchAll = (onSuccess , onError) => dispatch => {
    axios
        .get(`${url}programs`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.PROGRAM_FETCH_ALL,
                payload: response.data
            });
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

export const newGlobalVariable = (formData, onSuccess , onError) => dispatch => {
    axios
        .post(`${url}global-variables`, formData)
        .then(response => {
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

export const updateGlobalVariable = (id, formData, onSuccess , onError) => dispatch => {
    axios
        .put(`${url}global-variables/${id}`, formData)
        .then(response => {
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

export const deactivateProgram = (id, onSuccess , onError) => dispatch => {
    axios
        .delete(`${url}global-variables/${id}`)
        .then(response => {
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