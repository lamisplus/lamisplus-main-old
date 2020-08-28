import axios from "axios";
import { url as baseUrl , LABSERVICECODE} from "../api";
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

export const fetchAllLabTestOrder = (onSuccess, onError) => dispatch => {
  if(LABSERVICECODE){
  axios
    .get(`${baseUrl}encounters/${LABSERVICECODE}/{dateStart}/{dateEnd}`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.LABORATORY_TESTORDER,
        payload: response.data
      })
      console.log(response)
      onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_LABORATORY_TESTORDER,
        payload: 'Something went wrong, please try again'
      })
      onError();
      console.log(error)
    });
}
};
export const fetchAllLabTestOrderOfPatient = (id, onSuccess, onError )=> dispatch => {
  //console.log(id)
  if(id){
  axios
    .get(`${baseUrl}encounters/${id}/form-data`)
    .then(response => {
     
      dispatch({
        type: ACTION_TYPES.LABORATORY_TESTORDER_FOR_PATIENT,
        payload: response.data
      })
      console.log(response.data)
      onSuccess();
      
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_LABORATORY_TESTORDER_FOR_PATIENT,
        payload: error
      })
      onError();
      console.log(error)
    }
    );
}
};
export const fetchLabTestOrdersByEncounterID = (id)=> dispatch => {
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
export const createCollectedSample = (data, lab_id, onSuccess, onError ) => dispatch => {

  if(lab_id){
    
  axios
    .put(`${baseUrl}form-data/${lab_id}`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CREATE_COLLECT_SAMPLE,
        payload: response.data
      });
      onSuccess()
      //toast.success("Sample Collection was successful");
    })
    .catch(error =>{
      
      dispatch({
        type: ACTION_TYPES.ERROR_CREATE_COLLECT_SAMPLE,
        payload: error
      })
      onError()
      //toast.error("Something went wrong, please try again");
      
    });
  }else{
    toast.error("Something went wrong, please try again");
  }
};

export const dispatchedManifestSamples = (data, lab_id) => dispatch => {

  if(lab_id){
    
  axios
    .put(`${baseUrl}form-data/${lab_id}`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CREATE_COLLECT_SAMPLE,
        payload: response.data
      });
     
    })
    .catch(error =>{
      
      dispatch({
        type: ACTION_TYPES.ERROR_CREATE_COLLECT_SAMPLE,
        payload: error
      })
      
    });
  }else{
    toast.error("Something went wrong, please try again");
  }
};
export const sampleVerification = (data, lab_id, onSuccess, onError ) => dispatch => {

  if(lab_id){
    
  axios
    .put(`${baseUrl}form-data/${lab_id}`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CREATE_COLLECT_SAMPLE,
        payload: response.data
      });
      onSuccess()
      //toast.success("Sample verified successful");
      //setInterval(window.location.reload(false), 80000);
    })
    .catch(error =>{
      
      dispatch({
        type: ACTION_TYPES.ERROR_CREATE_COLLECT_SAMPLE,
        payload: error
      })
      onError()
      toast.error("Something went wrong, please try again");
      //setInterval(window.location.reload(false), 80000);
      //window.location.reload()
      
    });
  }else{
    toast.error("Something went wrong, please try again");
  }
};

export const transferSample = (samples, lab_id) => dispatch => {
 
  axios
    .put(`${baseUrl}form-data/`, samples)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.TRANSFER_SAMPLE,
        payload: response.data
      });
      //toast.success("Sample Transfer was successful");
    })
    .catch(error =>{
      
      dispatch({
        type: ACTION_TYPES.ERROR_TRANSFER_SAMPLE,
        payload: error
      })
      toast.error("Something went wrong, please try again");

    });
};
export const fetchFormById = id => dispatch => {
  //console.log(id)
  if(id){
  axios
    .get(`${baseUrl}form-data/${id}`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FORMDATA_FETCH_BY_ID,
        payload: response.data
      });
      //console.log("is getting here ") 
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_FORMDATA_FETCH_BY_ID,
        payload: error
      })
      console.log(error)
    }
    );
  }
};

export const create = data => dispatch => {
  axios
    .post(`${baseUrl}visits/`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CHECKIN_CREATE,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.CHECKIN_ERROR,
        payload: "Something went wrong, please try again"
      });
    });
};

export const update = (id, data) => dispatch => {
  axios
    .put(`${baseUrl}visits/${id}`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CHECKIN_UPDATE,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.CHECKIN_ERROR,
        payload: "Something went wrong, please try again"
      });
    });
};

export const Delete = id => dispatch => {
  axios
    .delete(`${baseUrl}visits/${id}`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.CHECKIN_DELETE,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch({
        types: ACTION_TYPES.CHECKIN_ERROR,
        payload: "Something went wrong, please try again"
      });
    });
};

export const fetchAllTestGroup = (onSuccess, onError) => dispatch => {
  axios
    .get(`${baseUrl}lab-test-groups/`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_TEST_GROUP,
        payload: response.data
      })
      onSuccess()
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.LABORATORY_ERROR,
        payload: 'Something went wrong, please try again'
      })
      onError(error.response)
    })
}

export const fetchAllTestsByTestGroup = (id, onSuccess, onError) => dispatch => {
  axios
    .get(`${baseUrl}lab-test-groups/${id}/lab-tests`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_TESTS_BY_TEST_GROUP,
        payload: response.data
      })
      onSuccess()
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.LABORATORY_ERROR,
        payload: 'Something went wrong, please try again'
      })
      onError(error.response)
    })
}

