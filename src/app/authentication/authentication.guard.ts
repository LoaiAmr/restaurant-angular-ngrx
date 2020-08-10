import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';


@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate {

    constructor(private authenticationService: AuthenticationService,
                private router: Router,
                private store: Store<fromApp.AppState>) {}



    canActivate(route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot):
        boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
            /** this is for subscribe on subject user in authentication service */
        // return this.authenticationService.user.pipe(
        //     take(1),
        //     map(user => {
        //         const isAuthenticate = !!user; /** it return true  or false */
        //         if (isAuthenticate) {
        //             return true;
        //         }
        //             return this.router.createUrlTree(['/auth']);
                
        //     })
        // );

        /**this is by ngrx way */
        return this.store.select('authReducer').pipe(
            take(1),
            map(authState => {return authState.user}),
            map(user => {
                const isAuthenticate = !!user; /** it return true  or false */
                if (isAuthenticate) {
                    return true;
                }
                    return this.router.createUrlTree(['/auth']);
                
            })
        );
    }





}