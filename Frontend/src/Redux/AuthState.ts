// global state for auth

import jwtDecode from "jwt-decode"
import { createStore } from "redux";
import UserModel from "../Models/UserModel";

export class AuthState {

    public token: string = null;
    public user: UserModel = null

    public constructor() {
        // take the token from session storage, restore if exist
        this.token = localStorage.getItem("token");

        if(this.token){
            const container: {user: UserModel} = jwtDecode(this.token);
            this.user = container.user;
        }
    }
}

// action type
export enum AuthActionType {
    ValidateRegister,
    Register,
    Login,
    Logout
}

// auth action
export interface AuthAction {
    type: AuthActionType;
    payload?: any;
}

// auth reducer
export function authReducer(currentState = new AuthState(), action: AuthAction): AuthState {

    //duplicate the current state
    const newState = {...currentState};
    
    // options for the needed operations
    switch(action.type) {

        // validate the first part of register
        case AuthActionType.ValidateRegister:
            newState.user = action.payload;
            break;
        
        // part 2 of register or login
        case AuthActionType.Register:
        case AuthActionType.Login:
            if(Array.isArray(action.payload.user)) action.payload.user = action.payload.user[0];
            newState.token = action.payload.token;
            newState.user = action.payload.user;
            localStorage.setItem("token", newState.token);
            break;

        // logout
        case AuthActionType.Logout:
            newState.token = null;
            newState.user = null;
            localStorage.removeItem("token");
            break;
    }

    // return the new state after the changes
    return newState;
}

// auth store
export const authStore = createStore(authReducer);