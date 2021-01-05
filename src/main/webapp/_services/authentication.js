import { BehaviorSubject } from 'rxjs';
import { url } from "../api";
import { handleResponse } from '../_helpers';
import store from '../store';
import * as ACTION_TYPES from "../actions/types";
import jwt_decode from "jwt-decode";
import _ from 'lodash';

const { dispatch } = store;
const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authentication = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value },
    getCurrentUserRole,
    getCurrentUser,
    userHasRole
};

function login(username, password, remember) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, remember })
    };

    return fetch(`${url}authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            dispatch({
                type: ACTION_TYPES.AUTHENTICATION,
                payload: "Authenticated"
            });
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}

function getCurrentUserRole() {
    //fetch all the permissions of the logged in user
    const user = currentUserSubject.value;
    if(!user || !user.id_token){
        return [];
    }

    const token = user.id_token;
    const decoded = jwt_decode(token);
    const permissions = decoded.auth;
    return permissions.split(',');
}

function userHasRole(role){
    const userRoles = getCurrentUserRole();
    if(role && role.length > 0 && _.intersection(role, userRoles).length === 0){
        return false;
    }
    return true;
}

function getCurrentUser(){
    const user = currentUserSubject.value;
    if(!user || !user.id_token){
        return [];
    }

    const token = user.id_token;
    const decoded = jwt_decode(token);
    return decoded;
}