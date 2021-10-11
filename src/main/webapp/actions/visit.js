import axios from "axios";
import { url as baseUrl } from "../api";
import * as ACTION_TYPES from "./types";


export const update = (id, data, onSuccess, onError) => dispatch => {
    axios
      .put(`${baseUrl}visits/${id}`, data)
      .then(response => {
        dispatch({
          type: ACTION_TYPES.UPDATE_VISIT,
          payload: response.data
        });
        if(onSuccess){
            onSuccess();
        }
      })
      .catch(error => {
        dispatch({
          type: ACTION_TYPES.UPDATE_VISIT_ERROR,
          payload: "Something went wrong, please try again"
        });
        if(onError){
            onError();
        }
      });
  };