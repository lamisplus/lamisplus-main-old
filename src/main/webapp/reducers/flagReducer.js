import * as ACTION_TYPES from '../actions/types'

const initialState = {
  flagList: []
}

const flagReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.WARD_LIST:
      return { ...state, wardList: [...action.payload] }
    default:
      return state
  }
}

export default flagReducer


