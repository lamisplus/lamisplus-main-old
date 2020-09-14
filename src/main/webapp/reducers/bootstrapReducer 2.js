import * as ACTION_TYPES from '../actions/types'

const initialState = {
  list: [],

}

const bootstrapModuleReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_ALL_BOOTSTRAP_MODULE:
      return { ...state, list: [...action.payload] }

    default:
      return state
  }
}

export default bootstrapModuleReducer


