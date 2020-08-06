import axios from "axios";
import { url } from "api";

export const fetchApplicationCodeSet = (codesetGroup, actionType, onSuccess , onError) => dispatch => {
    axios
      .get(`${url}application-codesets/codesetGroup?codesetGroup=${codesetGroup}`)
      .then(response => {
        dispatch({
          type: actionType,
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