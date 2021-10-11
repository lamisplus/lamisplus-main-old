 import * as ACTION_TYPES from "../actions/types";

const initialState = {
  allPrescriptions: [],
  patientPrescriptions: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.PHARMACY_FETCH_PRESCRIPTIONS:
      return { ...state, allPrescriptions: [...action.payload] };
    case ACTION_TYPES.FETCH_PATIENT_PRESCRIPTIONS:
      return { ...state, patientPrescriptions: [...action.payload] };
    case ACTION_TYPES.UPDATE_PRESCRIPTION_STATUS:
      return { ...state, update: action.payload };
    default:
      return state;
  }
};


