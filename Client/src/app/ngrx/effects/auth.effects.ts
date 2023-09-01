import { Injectable } from '@angular/core';
import * as AuthActions from '../actions/auth.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable()
export class AuthEffects {
  constructor(private action$: Actions, private authService: AuthService) {}

  login$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthActions.login),
      switchMap(() => {
        return this.authService.loginWithGoogle();
      }),
      map((idToken) => {
        if (idToken) {
          return AuthActions.loginSuccess();
        } else {
          return AuthActions.loginFailure({
            errorMessage: 'Login fail due to idToken not found',
          });
        }
      }),
      catchError((error) => {
        return of(AuthActions.loginFailure({ errorMessage: error }));
      })
    );
  });

  logout$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => {
        return this.authService.logout();
      }),
      map((res) => {
        if (res == 'Logout success!!!') {
          return AuthActions.logoutSuccess();
        }
        return AuthActions.loginFailure({ errorMessage: 'Login fail' });
      }),
      catchError((error) => {
        return of(AuthActions.loginFailure({ errorMessage: error }));
      })
    );
  });
}
