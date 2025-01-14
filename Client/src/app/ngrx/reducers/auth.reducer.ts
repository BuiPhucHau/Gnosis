import { createReducer, on } from '@ngrx/store';
import * as LoginActions from '../actions/auth.actions';
import { AuthState } from '../states/auth.state';

export const initialState: AuthState = {
  idToken: '',
  isLoading: false,
  isSuccessful: false,
  errorMessage: '',
  uid: '',
  isLogoutSuccess: false,
  logoutErrorMessage: '',
};

export const authReducer = createReducer(
  initialState,
  on(LoginActions.login, (state, action) => {
    console.log(action.type);
    return {
      ...state,
      isLoading: true,
      isSuccessful: false,
      errorMessage: '',
    };
  }),
  on(LoginActions.loginSuccess, (state, action) => {
    console.log(action.type);
    return {
      ...state,
      isLoading: false,
      isSuccessful: true,
      errorMessage: '',
    };
  }),
  on(LoginActions.loginFailure, (state, { errorMessage, type }) => {
    console.log(type);
    return {
      ...state,
      isLoading: false,
      isSuccessful: false,
      errorMessage,
    };
  }),
  on(LoginActions.logout, (state, action) => {
    console.log(action.type);
    return {
      ...state,
      isLogoutSuccess: false,
      logoutErrorMessage: '',
    };
  }),
  on(LoginActions.logoutSuccess, (state, action) => {
    console.log(action.type);
    return {
      ...state,
      isLogoutSuccess: true,
      isSuccessful: false,
      idToken: '',
      uid: '',
    };
  }),
  on(LoginActions.logoutFailure, (state, { errorMessage, type }) => {
    console.log(type);
    return {
      ...state,
      isLogoutSuccess: false,
      logoutErrorMessage: errorMessage,
    };
  }),
  on(LoginActions.storedIdToken, (state, { idToken, type }) => {
    console.log(type);
    return {
      ...state,
      idToken,
    };
  }),
  on(LoginActions.storedUserUid, (state, action) => {
    console.log(action.type);
    return {
      ...state,
      uid: action.uid,
    };
  })
);
