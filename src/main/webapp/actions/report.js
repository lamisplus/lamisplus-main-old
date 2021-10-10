import axios from "axios";
import {url as baseUrl, url} from '../api'
import * as ACTION_TYPES from "./types";
import {toast} from 'react-toastify';


export const creatReport = (data, onSuccess, onError) => dispatch => {
    console.log(data)
    axios
        .post(`${url}reports/`, data)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.REPORTS_CREATE_REPORT,
                payload: response.data
            });
            toast.success("Report was saved successfully!");
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


export const generateReport = (data, onSuccess, onError) => dispatch => {
    let reportFormat = 'application/'+(data.reportFormat).toLowerCase();
    if(reportFormat === 'application/excel'){
        reportFormat = 'application/vnd.ms-excel';
    }
    if(reportFormat === 'application/csv'){
        reportFormat = 'text/csv';
    }
    console.log(reportFormat);
    axios
        .post(`${url}reports/generate`, data, {responseType: 'arraybuffer'})
        .then(response => {
            if(onSuccess){
                onSuccess();
            }
        //Create a Blob from the PDF Stream
            const file = new Blob(
                [response.data],
                {type: reportFormat});
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
            window.open(fileURL);
        })
        .catch(error => {
            if(onError){
                onError();
            }
        });
}

export const  fetchById = (id, onSuccess, onError) => dispatch => {
    dispatch({
            type: ACTION_TYPES.REPORTS_FETCH_ALL,
        payload: {}
    })
    axios
        .get(`${baseUrl}reports/${id}/`)
        .then(response => {
            dispatch({
                    type: ACTION_TYPES.REPORTS_FETCH_ALL,
                payload: response.data
            })
            onSuccess()
        })
        .catch(error => {
            onError()
            dispatch({
                type: ACTION_TYPES.REPORTS_ERROR,
                payload: 'Error loading form, something went wrong. Please try again'
            })
        })
}

export const fetchAll = (onSuccess) => dispatch => {
    axios
        .get(`${url}reports`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.REPORTS_FETCH_ALL,
                payload: response.data
            })
            onSuccess()
        })
        .catch(error => {
            // onError()
            dispatch({
                type: ACTION_TYPES.REPORTS_ERROR,
                payload: 'Something went wrong, please try again'
            })

        })
}

export const update = (id, data, onSuccess,) => dispatch => {
    axios
        .put(`${url}reports/${id}`, data)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.REPORTS_UPDATE,
                payload: response.data
            });
            onSuccess()
            console.log(response)
        })
        .catch(error => {
            dispatch({
                type: ACTION_TYPES.REPORTS_ERROR,
                payload: 'Something went wrong, please try again'
            })
        })
}


export const Delete = (id, onSuccess, onError) => dispatch => {
    console.log(`${url}reports/${id}`);
    axios
        .delete(`${url}reports/${id}`)
        .then(response => {

            dispatch({
                type: ACTION_TYPES.REPORTS_DELETE,
                payload: id
            });
            if(onSuccess){
                onSuccess();
            }

        })
        .catch(error => {
            dispatch({
                type: ACTION_TYPES.REPORTS_ERROR,
                payload:error.response.data
            });
            if(onError){
                onError(error);
            }
        });
};
