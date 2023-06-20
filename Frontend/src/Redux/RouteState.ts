import { createStore } from "redux";

// the kind of global state
export class RouteState {
    public route: string
}

export enum RouteActionType {
    changeRoute
}

// A single object which dispatch sends to Redux for some change
export interface RouteAction {
    payload: string;
    type: RouteActionType
}

export function routeReducer(currentState = new RouteState(), action: RouteAction): RouteState {
    
    // duplicate the current state
    const newState = {...currentState};

    newState.route = action.payload

    return newState;
}

export const routeStore = createStore(routeReducer)