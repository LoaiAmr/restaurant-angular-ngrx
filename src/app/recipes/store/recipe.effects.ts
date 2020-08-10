import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer'
import * as RecipesActions from './recipe.actions';
import { Recipe } from '../recipe.model';

@Injectable()
export class RecipeEffects {

    // @Effect()
    // fetchRecipes = this.action$.pipe(ofType(RecipeActions.FETCH_RECIPES),
    //     switchMap(() => {
    //         return this.http.get<Recipe[]>('https://restaurant-angular-tutorial.firebaseio.com/recipes.json')
    //     }),
    //     map(recipes => {
    //         return recipes.map(recipe => {
    //             return {
    //                 ...recipe,
    //                 ingredients: recipe.ingredients ? recipe.ingredients : []
    //             };
    //         });
    //     }),
    //     map(recipes => {
    //         return new RecipeActions.SetRecipes(recipes);
    //     })
    // );

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>(
                'https://restaurant-angular-tutorial.firebaseio.com/recipes.json'
            );
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        map(recipes => {
            return new RecipesActions.SetRecipes(recipes);
        })
    );


    @Effect({dispatch: false})
    storeRecipes = this.actions$.pipe(ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
            return this.http.put(
                'https://restaurant-angular-tutorial.firebaseio.com/recipes.json',
                recipesState.recipes)
        })

    )


    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>) { }
}