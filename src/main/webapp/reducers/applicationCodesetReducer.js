import * as ACTION_TYPES from '../actions/types'

const initialState = {
  priorities: [],
  relationships: [],
  vlIndications: []
}

const applicationCodesetReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.APPLICATION_CODESET_PRIORITIES:
      return { ...state, priorities: [...action.payload] }

    case ACTION_TYPES.APPLICATION_CODESET_RELATIONSHIPS:
      return { ...state, relationships: [...action.payload] }

      case ACTION_TYPES.APPLICATION_CODESET_VL_INDICATION:
      return { ...state, vlIndications: [...action.payload] }
      
    default:
      return state
  }
}

export default applicationCodesetReducer


