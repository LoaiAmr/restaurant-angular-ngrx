import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, exhaustMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthenticationService } from './authentication.service';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthenticationInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthenticationService,
        private store: Store<fromApp.AppState>) { }


    intercept(request: HttpRequest<any>, next: HttpHandler) {

        /** this is for subscribe on subject user in authentication service */
        // return this.authService.user.pipe(
        //     take(1),
        //     exhaustMap(user => {

        //         /** if the user not login yet return it's request to get the token */
        //         if (!user) {
        //             return next.handle(request);
        //         }
        //         const modifiedRequest = request.clone({
        //             /** it used to add token to the request of user to make sure it be authenticated */
        //             params: new HttpParams().set('auth', user.token)
        //         });
        //         return next.handle(modifiedRequest);
        //     }));

        
        /**this is by ngrx way */
        return this.store.select('authReducer').pipe(
            take(1),
            map(authState => { return authState.user }),
            exhaustMap(user => {

                /** if the user not login yet return it's request to get the token */
                if (!user) {
                    return next.handle(request);
                }
                const modifiedRequest = request.clone({
                    /** it used to add token to the request of user to make sure it be authenticated */
                    params: new HttpParams().set('auth', user.token)
                });
                return next.handle(modifiedRequest);
            }));


    }

}