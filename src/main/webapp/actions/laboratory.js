import axios from "axios";
import { url as baseUrl , LABSERVICECODE} from "../api";
import {RADIOLOGY_TEST_ORDER} from "api/codes";
import * as ACTION_TYPES from "./types";
import { toast } from "react-toastify";
import { GiConsoleController } from "react-icons/gi";

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
      onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_LABORATORY_TESTORDER,
        payload: 'Something went wrong, please try again'
      })
      onError();
    });
}
};
export const fetchAllLabTestOrderOfPatient = (id, onSuccess, onError )=> dispatch => {
  if(id){
  axios
    .get(`${baseUrl}encounters/${id}/form-data`)
    .then(response => {
     
      dispatch({
        type: ACTION_TYPES.LABORATORY_TESTORDER_FOR_PATIENT,
        payload: response.data
      })
      onSuccess();
      
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_LABORATORY_TESTORDER_FOR_PATIENT,
        payload: error
      })
      onError();
    }
    );
}
};
export const fetchLabTestOrdersByEncounterID = (id)=> dispatch => {
  if(id){
  axios
    .get(`${baseUrl}encounters/${id}`)
    .then(response => {
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
      toast.success("Sample Collection successful");
    })
    .catch(error =>{
      console.log(error)
      dispatch({
        type: ACTION_TYPES.ERROR_CREATE_COLLECT_SAMPLE,
        payload: error
      })
      onError()
      toast.error("Something went wrong, please try again");
      
    });
  }else{
    toast.error("Something went wrong, please try again");
  }
};

export const updateFormDataObj = (data, lab_id) => dispatch => {
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
  

export const dispatchedManifestSamples = (data) => dispatch => {
  const options = {
    headers: {
        'Content-Type': 'application/json',
    }
  };
  axios
    .post(`${baseUrl}sample-manifests`, data, options)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.DISPATCH_MANIFEST_SAMPLE,
        payload: response.data
      });
    })
    .catch(error =>{
      
      dispatch({
        type: ACTION_TYPES.ERROR_DISPATCH_MANIFEST_SAMPLE,
        payload: error
      })
    });
  
};
//Samples Dispatched
export const sampleDispatched = (onSuccess, onError) => dispatch => {

  axios
    .get(`${baseUrl}sample-manifests/dispatched-manifest/true`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.SAMPLE_DISPATCHED,
        payload: response.data
      })
      onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_SAMPLE_DISPATCHED,
        payload: 'Something went wrong, please try again'
      })
      onError();
    });

};
// Sample Dispatched Detail by a particular ID MANIFEST_DETAIL_BY_ID
export const sampleDispatchedByManifestID = (manifestId, onSuccess, onError) => dispatch => {

  axios
    .get(`${baseUrl}sample-manifests/dispatched-manifest/true`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.MANIFEST_DETAIL_BY_ID,
        payload: response.data.filter((x) => x.manifestId === manifestId)
      })
      onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_MANIFEST_DETAIL_BY_ID,
        payload: 'Something went wrong, please try again'
      })
      onError();
    });

};
//Get list of samples Manifest by ID 
export const samplesManifestById = (id,onSuccess, onError) => dispatch => {
  if(id){
  axios
    .get(`${baseUrl}sample-manifests/manifest/${id}`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.SAMPLES_MANIFEST_BY_ID,
        payload: response.data
      });
      onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_SAMPLES_MANIFEST_BY_ID,
        payload: error
      })
      onError();
    }
    );
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
      toast.success("Sample verified successful");
      //setInterval(window.location.reload(false), 80000);
    })
    .catch(error =>{
      
      dispatch({
        type: ACTION_TYPES.ERROR_CREATE_COLLECT_SAMPLE,
        payload: error
      })
      onError()
      toast.error("Something went wrong, please try again");
      
    });
  }else{
    toast.error("Something went wrong, please try again");
  }
};

export const transferSample = (data, lab_id, onSuccess, onError ) => dispatch => {
 
  axios
    .put(`${baseUrl}form-data/${lab_id}`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.TRANSFER_SAMPLE,
        payload: response.data
      });
      onSuccess()
      toast.success("Sample Transfer  successful");
    })
    .catch(error =>{
      
      dispatch({
        type: ACTION_TYPES.ERROR_TRANSFER_SAMPLE,
        payload: error
      })
      onError()
      toast.error("Something went wrong, please try again");

    });
};
export const fetchFormById = id => dispatch => {
  if(id){
  axios
    .get(`${baseUrl}form-data/${id}`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FORMDATA_FETCH_BY_ID,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_FORMDATA_FETCH_BY_ID,
        payload: error
      })
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

export const fetchRadiologyTestOrdersByEncounterID = (id, onSuccess, onError)=> dispatch => {
  if(id){
    axios
        .get(`${baseUrl}encounters/${id}`)
        .then(response => {
          dispatch({
            type: ACTION_TYPES.FETCH_ALL_RADIOLOGY_TESTS_BY_ENCOUNTER_ID,
            payload: response.data
          })
            if(onSuccess){
                onSuccess()
            }
        })
        .catch(error => {
              dispatch({
                type: ACTION_TYPES.ERROR_LABORATORY_TESTORDER_FOR_LAB,
                payload: error
              })
            if(onError){
                onError()
            }
            }
        );
  }
};
export const fetchAllRadiologyTestOrder = (onSuccess, onError) => dispatch => {
    if(LABSERVICECODE){
        axios
            .get(`${baseUrl}encounters/${RADIOLOGY_TEST_ORDER}/{dateStart}/{dateEnd}`)
            .then(response => {
                dispatch({
                    type: ACTION_TYPES.RADIOLOGY_TEST_ORDERS,
                    payload: response.data
                })
                if(onSuccess){
                    onSuccess()
                }
            })
            .catch(error => {
                if(onError){
                    onError()
                }
            });
    }
};

export const updateRadiologyByFormId = (data, id, onSuccess, onError ) => dispatch => {
        axios
            .put(`${baseUrl}form-data/${id}`, data)
            .then(response => {
                if(onSuccess){
                    onSuccess()
                   
                }
            })
            .catch(error =>{
                if(onError){
                    onError()
                    
                }
            });
};

export const fetchAllRadiologyTestGroup = (onSuccess, onError) => dispatch => {
    axios
        .get(`${baseUrl}radiology-test-groups/`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.FETCH_ALL_RADIOLOGY_TEST_GROUP,
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

export const fetchAllRadiologyTestsByTestGroup = (id, onSuccess, onError) => dispatch => {
    axios
        .get(`${baseUrl}radiology-test-groups/radiology-tests/${id}`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.FETCH_ALL_RADIOLOGY_TESTS_BY_TEST_GROUP,
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
