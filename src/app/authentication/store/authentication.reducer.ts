import * as AuthenticationActions from './authentication.actions'

import { User } from '../user.model';

export interface State {
    user: User;
    authError: string,
    loading: boolean
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
};


export function authenticationReducer(state = initialState, action: AuthenticationActions.AuthActions) {
    switch (action.type) {

        case AuthenticationActions.AUTHENTICATE_SUCCESS:
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate
            );
            return {
                ...state,
                authError: null,
                user: user,
                loading: false
            };

        case AuthenticationActions.LOGOUT:
            return {
                ...state,
                user: null
            };
        case AuthenticationActions.LOGIN_START:
        case AuthenticationActions.SIGNUP_START:
            return {
                ...state,
                authError: null,
                loading: true
            }

        case AuthenticationActions.AUTHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            };

        case AuthenticationActions.CLEAR_ERROR:
            return {
                ...state,
                authError: null
            };

        default:
            return state;
    }
}