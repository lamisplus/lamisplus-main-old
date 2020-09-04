import { combineReducers } from 'redux'
import checkInReducer from './checkInReducer'
import patientReducer from './patientReducer'
import encounterReducer from './encounterReducer'
import formManagerReducer from './formManagerReducer'
import pharmReducer from "./pharmacyReducer";
import laboratoryReducer from "./laboratoryReducer"
import consultationReducer from './consultationReducer'
import medicationReducer from './medicationReducer'
import formReducers from './formReducers'
import visitReducer from './visitReducer'
import registrationReducer from './registrationReducer'
import userReducer from './userReducer'
import applicationCodesetReducer from './applicationCodesetReducer'
import appointmentReducer from './appointmentReducer'

export default combineReducers({
  patients: patientReducer,
  checkedIn: checkInReducer,
  pharmacy: pharmReducer,
  encounter: encounterReducer,
  laboratory: laboratoryReducer,
  formManager: formManagerReducer,
  consultations: consultationReducer,
  formReducers: formReducers,
  medication: medicationReducer,
  visit: visitReducer,
  registration: registrationReducer,
  users: userReducer,
  applicationCodesets: applicationCodesetReducer,
  appointments: appointmentReducer
})

