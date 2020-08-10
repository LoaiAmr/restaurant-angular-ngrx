import { ActionReducerMap } from '@ngrx/store';

import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuthentications from '../authentication/store/authentication.reducer';
import * as fromRecipeActions from '../recipes/store/recipe.reducer';

export interface AppState {
    shoppingList: fromShoppingList.State;
    authReducer: fromAuthentications.State;
    recipes: fromRecipeActions.State
}

export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    authReducer: fromAuthentications.authenticationReducer,
    recipes: fromRecipeActions.recipeReducer
};