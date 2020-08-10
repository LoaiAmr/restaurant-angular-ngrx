import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromApp from '../store/app.reducer'
import * as RecipeActions from '../recipes/store/recipe.actions'
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]>{

    constructor(
        private store: Store<fromApp.AppState>,
        private action$: Actions) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // return this.dataStorageService.fetchRecipes();
        return this.store.select('recipes').pipe(
            take(1),
            map(recipesState => {
                return recipesState.recipes;
            }),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    this.store.dispatch(new RecipeActions.FetchRecipes());
                    return this.action$.pipe(
                        ofType(RecipeActions.SET_RECIPES),
                        take(1)
                    );
                } else {
                    return of(recipes);
                }
            })
        );
    }
}
