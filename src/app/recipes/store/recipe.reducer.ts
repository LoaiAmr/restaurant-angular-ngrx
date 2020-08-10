import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions'

export interface State {
    recipes: Recipe[]
}

const initialState: State = {
    recipes: []
}


export function recipeReducer(state = initialState, action: RecipeActions.RecipeActions) {
    switch (action.type) {

        case RecipeActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            }

        case RecipeActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            }

        case RecipeActions.UPDATE_RECIPE:

            /** Override all the values of the old recipe with the updated values and save it in (updatedRecipe) */
            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.newRecipe
            }

            /** Copy the old recipe list */
            const updatedRecipes = [...state.recipes]
            /** Updated the old item in the by the new item */ 
            updatedRecipes[action.payload.index] = updatedRecipe

            return {
                ...state,
                recipes: updatedRecipes
            }

        case RecipeActions.DELETE_RECIPE:
            return {
                ...state,
                /**(filter function) always return new list with deleted new items if it exist*/
                recipes: state.recipes.filter((recipe, index) => {
                    return index !== action.payload
                })
            }


        default:
            return state;
    }
}