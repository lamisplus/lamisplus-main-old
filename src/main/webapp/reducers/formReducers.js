import * as FORMTYPES from '../actions/types'

const formReducer = (state = {  services:  [], form:[]}, action) => {
    switch(action.type){
        case FORMTYPES.FORMTYPES_FETCH_ALL:
            return {...state, form:action.payload}

        case FORMTYPES.FORMTYPES_FETCH_SERVICES:
            return {...state, services: action.payload}

        case FORMTYPES.FORMTYPES_CREATE_FORM:

            return { ...state, status: action.payload }

        case FORMTYPES.FORMTYPES_FETCH_BY_ID:
            return {...state, form:action.payload}

        case FORMTYPES.FORMTYPES_UPDATE:
            return {...state, form:action.payload}

        case FORMTYPES.FORMTYPES_ERROR:
            return {...state, errors:action.payload}

        default:
            return state
    }
}
export default formReducer