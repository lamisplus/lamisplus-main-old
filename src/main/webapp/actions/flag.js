import axios from "axios";
import { url } from "api";
import * as ACTION_TYPES from "./types";



export const fetchAllFlag = (onSuccess , onError) => dispatch => {
    axios
        .get(`${url}wards`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.WARD_LIST,
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

export const createFlag = (data, onSuccess , onError) => dispatch => {
    axios
        .post(`${url}wards`, data)
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

export const updateFlag = (id, data, onSuccess , onError) => dispatch => {
    axios
        .put(`${url}wards/${id}`, data)
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

export const deleteFlag = (id, onSuccess , onError) => dispatch => {
    axios
        .delete(`${url}wards/${id}`)
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