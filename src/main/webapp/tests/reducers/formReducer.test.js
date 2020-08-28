import formReducer from '../../reducers/formReducers';

const initialState = {
    modules: [],
    services: [],
    form:[]
};

describe('Test Suite for Form Reducer', () => {
    it('should set the default state', () => {
        const state = formReducer(initialState, { type: "@@INIT" });
        expect(state).toEqual(initialState);
    });

    it('should set the modules field in the default state', () => {
        const action = { type: 'FORMTYPES_FETCH_ALL', payload: ['a', 'b', 'c']}
        const state = formReducer(initialState, action);
        expect(state.modules).toEqual(['a', 'b', 'c']);
    });

    it('should set the services field in the state', () => {
        const action = {type: 'FORMTYPES_FETCH_SERVICES', payload: []}
        const state = formReducer(initialState, action);
        expect(state.services).not.toEqual(['a', 'b', 'c'])
    });

    it('should set the status field in the state object', () => {
        const action = { type: 'FORMTYPES_CREATE_FORM', payload: [] }
        const state = formReducer(initialState, action)
        expect(state.services).toEqual([]);
    });

    it('should set the form field in the state object', () => {
        const action = { type: 'FORMTYPES_FETCH_BY_ID', payload: ['1', '2', '3'] };
        const state = formReducer(initialState, action);
        expect(state.form).toEqual(['1', '2', '3']);
    })

    it("should set the form field in the state object", () => {
      const action = {
        type: "FORMTYPES_UPDATE",
        payload: ["1", "2", "3"],
      };
      const state = formReducer(initialState, action);
      expect(state.form).not.toEqual([]);
    });

})