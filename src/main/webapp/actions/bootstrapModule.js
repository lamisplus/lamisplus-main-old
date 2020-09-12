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
    .get(`${baseUrl}encounters`)
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

export const fetchBootstrapModuleID = (id)=> dispatch => {
  if(id){
  axios
    .get(`${baseUrl}encounters/${id}`)
    .then(response => {
       console.log(response)
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_TESTS_BY_ENCOUNTER_ID,
        payload: response.data
      })
      //onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_LABORATORY_TESTORDER_FOR_LAB,
        payload: error
      })
   
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

