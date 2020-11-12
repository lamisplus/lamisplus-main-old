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

export const fetchAllOrganizationalUnit = (onSuccess, onError) => dispatch => {

  axios
    .get(`${baseUrl}organisation-units`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_ORGANIZATIONAL_UNIT_MODULE,
        payload: response.data
      })
      console.log(response)
      onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_FETCH_ALL_ORGANIZATIONAL_UNIT_MODULE,
        payload: 'Something went wrong, please try again'
      })
      onError();
      console.log(error)
    });
};

export const fetchAllParentOrganizationalUnit = (id, onSuccess, onError)=> dispatch => {
  if(id){
  axios
    .get(`${baseUrl}organisation-units/parent-org-unit/${id}`)
    .then(response => {
       console.log(response)
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_PARENT_ORGANIZATIONAL_UNIT,
        payload: response.data
      })
      onSuccess && onSuccess();
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: ACTION_TYPES.ERROR_FETCH_ALL_PARENT_ORGANIZATIONAL_UNIT,
        payload: error
      })
      onError && onError();
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

export const Delete = (id) => dispatch => {
  console.log(`${baseUrl}patients/${id}`);
  axios
  .delete(`${baseUrl}organisation-units/${id}`)
  .then(response => {

    dispatch({
      type: ACTION_TYPES.DELETE_ORGANISATION_UNIT,
      payload: id
    });
    
    toast.success("Organisational Unit record was deleted successfully!");
  })
  .catch(error => {
    dispatch({
      type: ACTION_TYPES.DELETE_ORGANISATION_UNIT_ERROR,
      payload:error.response
    });
    console.log(error)
    
    // if(error.response.data.apierror.message===null || error.response.data.apierror.message===""){
    //   toast.error("Something went wrong");
    // }else{
    //   toast.error(error.response.data.apierror.message);
    // }
   //console.log(error.response.data.apierror.message);
  });
};
