import { url } from "../api";
import axios from "axios";

export const formRendererService = {
    fetchEncounterById,
    fetchFormByFormCode,
    updateFormData,
    updateEncounter
};

function fetchEncounterById(encounterId) {
   return axios
      .get(`${url}encounters/${encounterId}`, {})
}

function fetchFormByFormCode(formCode, formType) {
    return axios
       .get(`${url}forms/${formCode}/formCode?formType=${formType ? formType : 0}`, {})
 }

 function updateFormData(id, data){
    return axios.put(`${url}form-data/${id}`, data)
 }

function updateEncounter(id, data){
    return axios.put(`${url}encounters/${id}/retrospective-data`, data)
}