import axios from "axios";
import { url as baseUrl } from "../api";
import * as ACTION_TYPES from "./types";
import { toast } from "react-toastify";


/**
 * @Actions
 * CheckIn CRUD OPERATIONS
 * returns API response from server
 * =================================
 * fetchAll()
 * fetchById()
 * create()
 * update()
 * Delete()
 */

export const fetchAllBootstrapModule = (onSuccess, onError) => dispatch => {

  axios
    .get(`${baseUrl}modules`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_BOOTSTRAP_MODULE,
        payload: response.data
      })
      console.log(response)
      onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_FETCH_ALL_BOOTSTRAP_MODULE,
        payload: 'Something went wrong, please try again'
      })
      onError();
      console.log(error)
    });
};
export const fetchAllBootstrapModuleBYBatchNum = (status, batchNum,onSuccess, onError) => dispatch => {

  axios
    .get(`${baseUrl}modules/${status}/${batchNum}/`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_BOOTSTRAP_MODULE_BY_BATCH_NUM,
        payload: response.data
      })
      onSuccess(response.data);
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_FETCH_ALL_BOOTSTRAP_MODULE_BY_BATCH_NUM,
        payload: 'Something went wrong, please try again'
      })
      onError();
    });
};

export const installBootstrapModule = (id, onSuccess, onError)=> dispatch => {
  if(id){
  axios
    .post(`${baseUrl}modules/${id}/install/`)
    .then(response => {
       console.log(response)
      dispatch({
        type: ACTION_TYPES.INSTALL_BOOSTRAP_MODULE_BY_ID,
        payload: response.data
      })

      onSuccess && onSuccess(response.data);
      toast.success("Module installed successfully!");
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: ACTION_TYPES.ERROR_INSTALL_BOOSTRAP_MODULE_BY_ID,
        payload: error
      })
      onError && onError();
      toast.error("Something went wrong!");
    }
    );
    }
};
export const createBootstrapModule = (data) => dispatch => {
console.log(data)

const options = {
  headers: {
      'Content-Type': ' multipart/form-data',
  }
};
  axios
  
    .post(`${baseUrl}modules/upload`, data,options)
    .then(response => {
      console.log(response)
      dispatch({
        type: ACTION_TYPES.CREATE_BOOTSTRAP_MODULE,
        payload: response.data
      });
      //onSuccess()
      toast.success("Module Uploaded Successfully");
    })
    .catch(error =>{
      
      dispatch({
        type: ACTION_TYPES.ERROR_CREATE_BOOTSTRAP_MODULE,
        payload: error
      })
      //onError()
      console.log(error)
      toast.error("Something went wrong, please try again");
      
    });
  
};

export const startBootstrapModule = (onSuccess, onError)=> dispatch => {

  axios
    .post(`${baseUrl}modules/start/all`)
    .then(response => {
       console.log(response)
      dispatch({
        type: ACTION_TYPES.START_BOOSTRAP_MODULE,
        payload: response.data
      })

      onSuccess && onSuccess();
      toast.success("Module Restarted successfully!");
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: ACTION_TYPES.ERROR_START_BOOSTRAP_MODULE,
        payload: error
      })
      onError && onError();
      toast.error("Something went wrong! please try again..");
    }
    );

};


