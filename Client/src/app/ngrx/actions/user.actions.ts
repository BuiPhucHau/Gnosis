import { createAction, props } from '@ngrx/store';
import { UserInfo } from 'src/app/models/User.model';

export const createUser = createAction(
  '[User] Create User',
  props<{ idToken: string }>()
);

export const createUserSuccess = createAction('[User] Create User Success');

export const createUserFailure = createAction(
  '[User] Create User Failure',
  props<{ errorMessage: any }>()
);

export const getUser = createAction(
  '[User] Get',
  props<{ uid: string; idToken: string }>()
);

export const getUserSuccess = createAction(
  '[User] Get Success',
  props<{ user: UserInfo }>()
);

export const getUserFailure = createAction(
  '[User] Get Failure',
  props<{ errorMessage: any }>()
);

export const clearUserInfo = createAction('[User] Clear Info');