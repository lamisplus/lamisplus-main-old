import * as ACTION_TYPES from '../actions/types'

const initialState = {
  list: [],
  patient: {},
  tests: [],
  testGroup: [],
  testorder:[],
  formdata:[]
}

const laboratoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.LABORATORY_TESTORDER:
      return { ...state, list: [...action.payload] }

    case ACTION_TYPES.LABORATORY_TESTORDER_FOR_PATIENT:
      return { ...state, testorder: [...action.payload] }

    case ACTION_TYPES.CREATE_COLLECT_SAMPLE:
      return { ...state, status: action.payload }

    case ACTION_TYPES.ERROR_CREATE_COLLECT_SAMPLE:
      return { ...state, errmsg: action.payload }

    case ACTION_TYPES.FORMDATA_FETCH_BY_ID:
      return { ...state, formdata: action.payload }
    
    case ACTION_TYPES.FETCH_ALL_TEST_GROUP:
      return { ...state, testGroup: action.payload }

    case ACTION_TYPES.FETCH_ALL_TESTS_BY_TEST_GROUP:
      return { ...state, tests: action.payload }

    case ACTION_TYPES.FETCH_ALL_TESTS_BY_ENCOUNTER_ID:
        return { ...state, tests: action.payload }

      

    default:
      return state
  }
}

export default laboratoryReducer


