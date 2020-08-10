import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects'
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'

import * as AuthActions from './authentication.actions'
import { User } from '../user.model';
import { AuthenticationService } from '../authentication.service';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; /** (?) means this is optional  */
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(
        new Date().getTime() + expiresIn * 1000
    );

    /** To set the data of user in localstorage */
    const user = new User(email, userId, token, expirationDate)
    localStorage.setItem('userData', JSON.stringify(user));

    /** To verfy from the authentication for the user */
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true
    });
}


const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist.';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct.';
            break;
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthenticationEffects {

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http
                .post<AuthResponseData>(
                    'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
                    environment.firebaseAPIKey,
                    {
                        email: signupAction.payload.email,
                        password: signupAction.payload.password,
                        returnSecureToken: true
                    }
                )
                .pipe(
                    tap(resData => {
                        /**we multiply in 1000 because we need to convert milliseconds in seconds )  */
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    }),
                    map(resData => {
                        return handleAuthentication(
                            +resData.expiresIn,
                            resData.email,
                            resData.localId,
                            resData.idToken
                        );
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    })
                );
        })
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http
                .post<AuthResponseData>(
                    'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
                    environment.firebaseAPIKey,
                    {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }
                )
                .pipe(
                    tap(resData => {
                        /**we multiply in 1000 because we need to convert milliseconds in seconds )  */
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    }),
                    map(resData => {
                        return handleAuthentication(
                            +resData.expiresIn,
                            resData.email,
                            resData.localId,
                            resData.idToken
                        );
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    })
                );
        })
    );


    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSeccesAction: AuthActions.AuthenticateSuccess) => {
            if(authSeccesAction.payload.redirect){
                this.router.navigate(['/']);
            }
        })
    );



    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                /**it must be the same name in attribute in localStorage */
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string
            } = JSON.parse(localStorage.getItem('userData'));


            if (!userData) {
                return { type: 'DUMMY' };
            }

            const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
            );

            if (loadedUser.token) {
                const expirationDuration =
                    new Date(userData._tokenExpirationDate).getTime() -
                    new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration)
                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate),
                    redirect: false
                });

                // this.autoLogout(expirationDuration);
            }
            return { type: 'DUMMY' }
        })
    );


    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    );




    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthenticationService
    ) { }
}
