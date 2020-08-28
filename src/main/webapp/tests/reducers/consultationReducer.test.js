import consultationReducer from '../../reducers/consultationReducer'; 

const initialState = {
    newConsultation: {}
}

describe('Test Suite for Patient Reducer', () => {
    it('should set default state', () => {
        const state = consultationReducer(initialState, { type: "@@INIT" });
        expect(state).toEqual(initialState);
    });

    it('should set the new consulation field of the state object to the action payload', () => {
        const action = { type: 'CONSULTATION_CREATE', payload: [] };
        const state = consultationReducer(initialState, action);

        expect(state.newConsultation).toEqual([]);
    });
})