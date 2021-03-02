import axios from "axios";
import { url } from "api";
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

export const createProgram = (formData, onSuccess , onError) => dispatch => {
    axios
        .post(`${url}programs`, formData)
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

export const updateProgram = (id, formData, onSuccess , onError) => dispatch => {
    axios
        .put(`${url}programs/${id}`, formData)
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

export const deleteProgram = (id, onSuccess , onError) => dispatch => {
    axios
        .delete(`${url}programs/${id}`)
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