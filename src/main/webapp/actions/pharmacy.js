import axios from "axios";
import {url, PHARMACYSERVICECODE} from "../api";
import * as ACTION_TYPES from "./types";
import {toast} from "react-toastify"

/**
 * ===============================================================================
 * @Actions
 * Encounter CRUD OPERATIONS
 * returns API response from server => payload: response || error
 * @method GET => fetchPrescriptions() -> get all encounters: params {null} || query {dateStart}{dateEnd}
 *@method GET => fetchPatientPrescriptions() -> get all prescriptions for a patient: params {patientId} || query {}
 *================================================================================
 */

export const fetchPrescriptions = () => dispatch => {
  axios
    .get(
      `${url}encounters/${PHARMACYSERVICECODE}/{dateStart}/{dateEnd}`
    )
    .then((response) => {
      console.log(response)
      dispatch({
        type: ACTION_TYPES.PHARMACY_FETCH_PRESCRIPTIONS,
        payload: response.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: ACTION_TYPES.PHARMACY_ERROR,
        payload: "Something went wrong",
      });
    });
};

export const fetchPatientPrescriptions = (patientId) => dispatch => {
  console.log(patientId)
  axios
    .get(
      `${url}patients/${patientId}/encounters/${PHARMACYSERVICECODE}/{dateStart}/{dateEnd}`
    )
    .then((response) => {
      dispatch({
        type: ACTION_TYPES.FETCH_PATIENT_PRESCRIPTIONS,
        payload: response.data,
      });
    })
    .catch((error) => {
      console.log("Pharmacy Error: ", error);
      dispatch({
        type: ACTION_TYPES.PHARMACY_ERROR,
        payload: "Something went wrong",
      });
    });

}

export const fetchAll = (onSuccess, onError) => dispatch => {
  axios
      .get(`${url}drugs/`)
      .then(response => {
        dispatch({
          type: ACTION_TYPES.MEDICATION_FETCH,
          payload: response.data
        })
        onSuccess()
      })
      .catch(error => {
        dispatch({
          type: ACTION_TYPES.MEDICATION_ERROR,
          payload: 'Something went wrong, please try again'
        })
        onError(error.response)
      })
}
// export const fetchEncounterById = (encounterId) => (dispatch) => {
//          console.log(encounterId);
//          axios
//            .get(
//              `${url}encounters/${encounterId}/form-data`
//            )
//            .then((response) => {
//              dispatch({
//                type: ACTION_TYPES.FETCH_ENCOUNTER_BY_ID,
//                payload: response.data,
//              });
//            })
//            .catch((error) => {
//              console.log("Pharmacy Error: ", error);
//              dispatch({
//                type: ACTION_TYPES.PHARMACY_ERROR,
//                payload: "Something went wrong",
//              });
//            });
// };
       
// axios.put(`${url}form-data/${formId}`)
export const updatePrescriptionStatus = (formId, data, onSuccess, onError) => (dispatch) => {
      console.log(data)
      console.log(formId)
      
         axios
           .put( `${url}form-data/${formId}`, data)
           .then((response) => {
             dispatch({
               type: ACTION_TYPES.UPDATE_PRESCRIPTION_STATUS,
               payload: response.data,
             });
             onSuccess()
             toast.success("Drug was successful dispensed");
           })
           .catch((error) => {
             console.log("Pharmacy Error: ", error);
             dispatch({
               type: ACTION_TYPES.PHARMACY_ERROR,
               payload: "Something went wrong",
             });
             onError()
             
             toast.error("Failed to dispense drug, please try again");
           });
       };

       export const fetchPatientPrescriptionsByEncounter = (id, onSuccess, onError )=> dispatch => {
        if(id){
        axios
          .get(`${url}form-data/${id}`)
          .then(response => {
           
            dispatch({
              type: ACTION_TYPES.PHARMACY_PRESCRIPTION_FOR_PATIENT,
              payload: response.data
            })
            onSuccess();
            
          })
          .catch(error => {
            dispatch({
              type: ACTION_TYPES.ERROR_PHARMACY_PRESCRIPTION_FOR_PATIENT,
              payload: error
            })
            onError();
          }
          );
      }
      };