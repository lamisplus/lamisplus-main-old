import patientReducer from '../../reducers/patientReducer';

const initialState = {
  list: [],
  status: 0,
  vitalSigns: {},
  vitalSignsList: [],
  allergies: {},
  patient: {},
  previousMedications: [],
  encounters: [],
  exclusiveEncounters: [],
  previousTestOrders: [],
};

describe('Test Suite for Patient Reducer', () => {
    it('should set default state', () => {
         const state = patientReducer(initialState, { type: "@@INIT" });
         expect(state).toEqual(initialState);
    });

    it('should set list field in state object to action payload', () => {
        const action = { type: 'PATIENTS_FETCH_ALL', payload: [] };
        const state = patientReducer(initialState, action);
        expect(state.list).toEqual([])
    });

    it('should set patient field in state object to action payload', () => {
        const action = { type: "PATIENTS_FETCH_BY_ID", payload: [] };
        const state = patientReducer(initialState, action);
        expect(state.patient).toEqual([]);
    });

    it("should not set status field in state object to action payload", () => {
      const action = { type: "PATIENTS_CREATE", payload: [] };
      const state = patientReducer(initialState, action);
      expect(state.status).not.toEqual(['a', 'b', 'c']);
    });

    it("should set status field in state object to action payload", () => {
      const action = { type: "PATIENTS_CREATE", payload: [] };
      const state = patientReducer(initialState, action);
      expect(state.status).toEqual([]);
    });

    it("should set error message field in state object to action payload", () => {
      const action = { type: "PATIENTS_ERROR", payload: [] };
      const state = patientReducer(initialState, action);
      expect(state.errormsg).not.toEqual(["a", "b", "c"]);
    });

    it('should set the updated field in state object to action payload', () => {
        const action = { type: 'PATIENTS_UPDATE', payload: ['a', 'b', 'c'] };
        const state = patientReducer(initialState, action);
        expect(state.updated).not.toEqual([]);
    });
  
   it("should set list field in state object to action payload", () => {
     const action = { type: "PATIENTS_DELETE", payload: [] };
     const state = patientReducer(initialState, action);
     expect(state.list).toEqual([]);
   });
  
  it('should set the vital signs list field in state object to action payload', () => {
    const action = { type: 'PATIENT_VITAL_SIGNS', payload: [] };
    const state = patientReducer(initialState, action);
    expect(state.vitalSignsList).toEqual([]);
  });

  it('should set the vital signs field in state object to action payload ', () => {
    const action = { type: "PATIENT_LATEST_VITAL_SIGNS", payload: [] };
    const state = patientReducer(initialState, action);
    expect(state.vitalSigns).toEqual([]);
  });

  it('should set the allergies field in the state object to action payload', () => {
    const action = { type: 'PATIENT_ALLERGIES', payload: [] };
    const state = patientReducer(initialState, action);
    expect(state.allergies).not.toEqual(['1', '2', '3']);
  });

  it('should set the previous medications field in the state object to action payload', () => {
    const action = { type: "PATIENT_LATEST_MEDICATION_LIST", payload: [] };
    const state = patientReducer(initialState, action);
    expect(state.previousMedications).toEqual([]);
  });

  it('should set the encounters field in the state object to action payload', () => {
    const action = { type: "PATIENT_ENCOUNTER_LIST", payload: [] };
    const state = patientReducer(initialState, action);
    expect(state.encounters).toEqual([]);
  });

  it('should set the exclusive encounters field in the state object to action payload', () => {
      const action = { type: "PATIENT_EXCLUSIVE_ENCOUNTER_LIST", payload: [] };
      const state = patientReducer(initialState, action);
      expect(state.exclusiveEncounters).toEqual([]);
  });

  it('should set the previous test orders field in the state object to action payload', () => {
    const action = { type: "PATIENT_LAB_ORDERS", payload: [] };
    const state = patientReducer(initialState, action);
    expect(state.previousTestOrders).toEqual([]);
  });

  it('should set the countries field in the state object to the action payload', () => {
    const action = { type: "FETCH_COUNTRIES", payload: [] };
    const state = patientReducer(initialState, action);
    expect(state.countries).toEqual([]);
  });
})