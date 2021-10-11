import laboratoryReducer from '../../reducers/laboratoryReducer';


const initialState = {
  list: [],
  patient: {},
  tests: [],
  testGroup: [], 
  testorder: [],
  formdata: [],
};

describe('Test Suite for Laboratory Reducer', () => {
    it("should set default state", () => {
        const state = laboratoryReducer(initialState, { type: "@@INIT" });
        expect(state).toEqual(initialState);
    });
    
    it('should set list array in state to action payload', () => {
        const action = { type: 'LABORATORY_TESTORDER', payload: ['a', 'b', 'c'] };
        const state = laboratoryReducer(initialState, action)
        expect(state.list).toEqual(['a', 'b', 'c'])
    });

    it('should set status in state object to action payload', () => {
        const action = { type: 'LABORATORY_TESTORDER_FOR_PATIENT', payload: ['a', 'b', 'c'] };
        const state = laboratoryReducer(initialState, action);
        expect(state.testorder).toEqual(['a', 'b', 'c'])
    });

    it('should set an error message in state object with the payload', () => {
        const action = { type: 'ERROR_CREATE_COLLECT_SAMPLE', payload: [] };
        const state = laboratoryReducer(initialState, action)
        expect(state.errmsg).toEqual([]);
    });

    it('should set the action payload as form data', () => {
        const action = { type: 'FORMDATA_FETCH_BY_ID', payload: ['a', 'b', 'c'] };
        const state = laboratoryReducer(initialState, action);
        expect(state.formdata).not.toEqual([])
    });

    it("should set the action payload as form data in state object", () => {
        const action = { type: "FORMDATA_FETCH_BY_ID", payload: ["a", "b", "c"] };
        const state = laboratoryReducer(initialState, action);
        expect(state.formdata).toEqual(['a', 'b', 'c']);
    });

    it("should set the action payload as test group in state object", () => {
        const action = {
            type: "FETCH_ALL_TEST_GROUP",
            payload: ["a", "b", "c"],
        };
        const state = laboratoryReducer(initialState, action);
        expect(state.testGroup).toEqual(["a", "b", "c"]);
    });
    
    it("should not set the action payload as tests in state object", () => {
        const action = {
            type: "FETCH_ALL_TESTS_BY_TEST_GROUP",
            payload: ["a", "b", "c"],
        };
        const state = laboratoryReducer(initialState, action);
        expect(state.tests).not.toEqual([]);
    });

    it("should set the action payload as tests in state object", () => {
        const action = {
            type: "FETCH_ALL_TESTS_BY_TEST_GROUP",
            payload: ["a", "b", "c"],
        };
        const state = laboratoryReducer(initialState, action);
        expect(state.tests).toEqual(["a", "b", "c"]);
    });
});