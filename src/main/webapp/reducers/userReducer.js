import * as USERTYPES from '../actions/types'

const userReducer = (state = { list:[] ,status: 0, user: {} }, action) => {
    switch(action.type){
        case USERTYPES.FETCH_USERS:
            return {...state, user:action.payload}

        case USERTYPES.REGISTER_REQUEST:

            return { ...state, status: action.payload }

        case USERTYPES.FETCH_USER_BY_ID:
            return {...state, user:action.payload}

        case USERTYPES.USERS_ERROR:
            return {...state, errors:action.payload}

        default:
            return state
    }
}
export default userReducer