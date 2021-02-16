import axios from "axios";
import {url} from '../api'
import * as ACTION_TYPES from "./types";
import {toast} from 'react-toastify';


export const creatReport = (data, onSuccess, onError) => dispatch => {
    console.log(data)
    axios
        .post(`${url}jasper-reports/`, data)
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


export const generateReport = (data, onError) => dispatch => {
    const reportType = 'application/'+(data.reportType).toLowerCase();
    axios
        .post(`${url}reports/generate`, data, {responseType: 'arraybuffer'})
        .then(response => {
        //Create a Blob from the PDF Stream
            const file = new Blob(
                [response.data],
                {type: reportType});
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

export const fetchAll = (onSuccess) => dispatch => {
    axios
        .get(`${url}jasper-reports`)
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

export const update = (id, data) => dispatch => {
    axios
        .put(`${url}jasper-reports/${id}`, data)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.REPORTS_UPDATE,
                payload: response.data
            });
            toast.success("Report was updated successfully!");
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
    console.log(`${url}jasper-reports/${id}`);
    axios
        .delete(`${url}jasper-reports/${id}`)
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
