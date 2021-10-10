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
    .get(`${baseUrl}organisation-unit-levels`)
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
    .get(`${baseUrl}organisation-units/organisation-unit-level/${id}`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_PARENT_ORGANIZATIONAL_UNIT,
        payload: response.data
      })
      onSuccess && onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_FETCH_ALL_PARENT_ORGANIZATIONAL_UNIT,
        payload: error
      })
      onError && onError();
    }
    );
    }
};

export const fetchAllParentOrganizationalUnitlevel = (id, onSuccess, onError)=> dispatch => {
  if(id){
  axios
    .get(`${baseUrl}organisation-units/organisation-unit-level/${id}`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_PARENT_ORGANIZATIONAL_UNIT_LEVEL,
        payload: response.data
      })
      onSuccess && onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_FETCH_ALL_PARENT_ORGANIZATIONAL_UNIT_LEVEL,
        payload: error
      })
      onError && onError();
    }
    );
    }
};


export const createOrganisationUnit = (data, onSuccess,onError) => dispatch => {
console.log(data)

  axios
    .post(`${baseUrl}organisation-unit-levels`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CREATE_ORGANISATION_UNIT,
        payload: response.data
      });
      onSuccess()
      toast.success("Organisational Unit Created Successfully");
    })
    .catch(error =>{
      
      dispatch({
        type: ACTION_TYPES.ERROR_CREATE_ORGANISATION_UNIT,
        payload: error
      })
      onError()
      toast.error("Something went wrong, please try again");
      
    });
  
};


export const createOrgUnitLevel = (data, onSuccess,onError) => dispatch => {
  
    axios
      .post(`${baseUrl}organisation-units`, data)
      .then(response => {
        dispatch({
          type: ACTION_TYPES.CREATE_ORGANISATION_UNIT_LEVELS,
          payload: response.data
        });
        onSuccess()
        toast.success("Organisational Unit Created Successfully");
      })
      .catch(error =>{
        
        dispatch({
          type: ACTION_TYPES.ERROR_ORGANISATION_UNIT_LEVELS,
          payload: error
        })
        onError()
        toast.error("Something went wrong, please try again");
        
      });
    
  };


export const deleteOrgUnitLevel = (id, onSuccess,onError) => dispatch => {
  axios
  .delete(`${baseUrl}organisation-unit-levels/${id}`)
  .then(response => {

    dispatch({
      type: ACTION_TYPES.DELETE_ORGANISATION_UNIT,
      payload: id
    });
    onSuccess()
    toast.success("Organisational Unit Level record was deleted successfully!");
  })
  .catch(error => {
    dispatch({
      type: ACTION_TYPES.DELETE_ORGANISATION_UNIT_ERROR,
      payload:error.response
    });
    onError()
    toast.error("Something went wrong, please try again");
    
  });
};


export const deleteOrgUnit = (id, onSuccess,onError) => dispatch => {
  axios
  .delete(`${baseUrl}organisation-units/${id}`)
  .then(response => {

    dispatch({
      type: ACTION_TYPES.DELETE_ORGANISATION_UNIT,
      payload: id
    });
    onSuccess()
    toast.success("Organisational Unit record was deleted successfully!");
  })
  .catch(error => {
    dispatch({
      type: ACTION_TYPES.DELETE_ORGANISATION_UNIT_ERROR,
      payload:error.response
    });
    onError()
    toast.error("Something went wrong, please try again");
    
  });
};

export const updateOrganisationUnitLevel = (id, data, onSuccess,onError) => dispatch => {
  axios
  .put(`${baseUrl}organisation-unit-levels/${id}`, data)
  .then(response => {

    dispatch({
      type: ACTION_TYPES.UPDATE_ORGANISATION_UNIT,
      payload: id
    });
    onSuccess()
    toast.success("Organisational Unit record was updated successfully!");
  })
  .catch(error => {
    dispatch({
      type: ACTION_TYPES.UPDATE_ORGANISATION_UNIT_ERROR,
      payload:error.response
    });
    onError()
    toast.error("Something went wrong, please try again");
    
  });
};

export const updateOrganisationUnit = (id, data, onSuccess,onError) => dispatch => {
  axios
  .put(`${baseUrl}organisation-units/${id}`, data)
  .then(response => {

    dispatch({
      type: ACTION_TYPES.UPDATE_ORGANISATION_UNIT,
      payload: id
    });
    onSuccess()
    toast.success("Organisational Unit record was updated successfully!");
  })
  .catch(error => {
    dispatch({
      type: ACTION_TYPES.UPDATE_ORGANISATION_UNIT_ERROR,
      payload:error.response
    });
    onError()
    toast.error("Something went wrong, please try again");
    
  });
};
