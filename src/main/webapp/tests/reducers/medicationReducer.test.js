import medicationReducer from '../../reducers/medicationReducer';

const initialState = {
    medicationList: [],
    errors: {}
}

describe('Test Suite for Medication Reducer', () => {
    it("should set default state", () => {
      const state = medicationReducer(initialState, { type: "@@INIT" });
      expect(state).toEqual(initialState);
    });

    it('should set medicationList as action payload', () => {
        const action = { type: 'MEDICATION_FETCH', payload: ['one', 'two', 'three'] }
        const state = medicationReducer(initialState, action)
        expect(state.medicationList).toEqual(["one", "two", "three"]);
    });

    it("should not set medicationList as action payload", () => {
      const action = {
        type: "MEDICATION_ERROR",
        payload: ["one", "two", "three"],
      };
      const state = medicationReducer(initialState, action);
      expect(state.errors).not.toEqual([]);
    });

     it("should set medicationList as action payload", () => {
       const action = {
         type: "MEDICATION_ERROR",
         payload: ["one", "two", "three"],
       };
       const state = medicationReducer(initialState, action);
       expect(state.errors).toEqual(["one", "two", "three"]);
     });
}); 