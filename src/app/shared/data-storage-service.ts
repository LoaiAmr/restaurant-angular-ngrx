import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthenticationService } from '../authentication/authentication.service';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';


@Injectable({ providedIn: 'root' })
export class DataStorageService {

    constructor(private http: HttpClient,
        private authenticationService: AuthenticationService,
        private store: Store<fromApp.AppState>
        ) { }


    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://restaurant-angular-tutorial.firebaseio.com/recipes.json', recipes)
            .subscribe(
                (response => {
                    console.log(response);
                })
            );
    }


    fetchRecipes() {
        return this.http.get<Recipe[]>('https://restaurant-angular-tutorial.firebaseio.com/recipes.json').
            pipe(map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }), tap(recipes => {
                // this.recipeService.setRecipesInDataStorageService(recipes);
                this.store.dispatch(new RecipeActions.SetRecipes(recipes));
            }));



    }





}