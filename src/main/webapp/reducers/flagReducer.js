import * as ACTION_TYPES from '../actions/types'

const initialState = {
  flagList: []
}

const flagReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.FLAG_LIST:
      return { ...state, flagList: [...action.payload] }
    default:
      return state
  }
}

export default flagReducer


