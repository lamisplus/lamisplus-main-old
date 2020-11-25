
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { authentication } from '_services/authentication';

const userRoles = authentication.getCurrentUserRole();

export const PrivateRoute = ({ component: Component, roles,  ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('currentUser')
            ?
            !authentication.userHasRole(roles) ?
                <Redirect to={{ pathname: '/unauthorised', state: { from: props.location } }} /> :
                <Component {...props} />

            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)