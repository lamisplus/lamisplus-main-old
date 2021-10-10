import axios from "axios";
import { url } from "api";
import * as ACTION_TYPES from "./types";



export const fetchAllFlag = (onSuccess , onError) => dispatch => {
    axios
        .get(`${url}flags`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.FLAG_LIST,
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
        .post(`${url}flags`, data)
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
        .put(`${url}flags/${id}`, data)
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
        .delete(`${url}flags/${id}`)
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