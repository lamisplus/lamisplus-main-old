import axios from "axios";
import { url } from "api";
import {APPOINTMENT_FORM, GENERAL_SERVICE} from "api/codes";
import * as ACTION_TYPES from "./types";


export const fetchAllAppointments = (onSuccess , onError) => dispatch => {
    axios
      .get(`${url}encounters/${APPOINTMENT_FORM}/{dateStart}/{dateEnd}`)
      .then(response => {
        dispatch({
          type: ACTION_TYPES.APPOINTMENTS_FETCH_ALL,
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