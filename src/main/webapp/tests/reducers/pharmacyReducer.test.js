import pharmacyReducer from '../../reducers/pharmacyReducer';


const initialState = {
  allPrescriptions: [],
  patientPrescriptions: [],
};

describe('Test Suite for Pharmacy Reducer', () => {
    it('should set default state', () => {
        const state = pharmacyReducer(initialState, { type: "@@INIT" });
        expect(state).toEqual(initialState);
    });

    it('should set allPrescriptions field to the action payload', () => {
        const action = { type: "PHARMACY_FETCH_PRESCRIPTIONS", payload: ["a", "b", "c"]};
        const state = pharmacyReducer(initialState, action);

        expect(state.allPrescriptions).toEqual(["a", "b", "c"]);
    }) 

    it("should set patientPrescriptions field to the action payload", () => {
      const action = { type: "FETCH_PATIENT_PRESCRIPTIONS", payload: ["a", "b", "c"]};
      const state = pharmacyReducer(initialState, action);

      expect(state.patientPrescriptions).toEqual(["a", "b", "c"]);
    });  

     it("should set the state update field to the action payload", () => {
       const action = {
         type: "UPDATE_PRESCRIPTION_STATUS",
         payload: ["a", "b", "c"],
       };
       const state = pharmacyReducer(initialState, action);

       expect(state.update).toEqual(["a", "b", "c"]);
     }); 
})