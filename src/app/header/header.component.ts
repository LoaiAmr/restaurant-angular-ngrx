import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../authentication/store/authentication.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class headerComponent implements OnInit, OnDestroy {

    isAuthenticated = false;
    authenticationSubsription: Subscription;


    constructor(private store: Store<fromApp.AppState>) { }



    ngOnInit() {

        this.authenticationSubsription = this.store.select('authReducer').pipe(map(authState => authState.user))
            .subscribe(user => {
                this.isAuthenticated = !user ? false : true;
            });

    }

    onSaveRecipes() {
        this.store.dispatch(new RecipeActions.StoreRecipes());
    }

    onGetRecipes() {
        this.store.dispatch(new RecipeActions.FetchRecipes())
    }


    onLogout() {
        this.store.dispatch(new AuthActions.Logout());
    }

    ngOnDestroy() {
        this.authenticationSubsription.unsubscribe();
    }

}