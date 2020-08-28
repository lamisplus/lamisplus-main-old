import { url } from "../api";
import axios from "axios";

export const formRendererService = {
    fetchEncounterById,
    fetchFormByFormCode,
    updateFormData
};

function fetchEncounterById(encounterId) {
   return axios
      .get(`${url}encounters/${encounterId}`, {})
}

function fetchFormByFormCode(formCode) {
    return axios
       .get(`${url}forms/${formCode}/formCode`, {})
 }

 function updateFormData(id, data){
    return axios.put(`${url}form-data/${id}`, data)
 }