
import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.action';


export interface State {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apple', 5),
        new Ingredient('Tomatoes', 10),
        new Ingredient('Potatoes', 23)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1  /** not (zero) because it can be index in array */
}

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };

        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };

        case ShoppingListActions.UPDATE_INGREDIENT:

            /** Override all the values of the old ingredient with the updated values and save it in (updatedIngredient) */
            const updatedIngredient = {
                ...state,
                ...action.payload
            }

            /** Copy the old ingredient list */
            const updatedIngredients = [...state.ingredients]
            /** Updated the old item in the by the new item */
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };

        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ig, ingredientIndex) => {
                    return ingredientIndex !== state.editedIngredientIndex;
                }),
                editedIngredientIndex: -1,
                editedIngredient: null
            };

        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: { ...state.ingredients[action.payload] }
            }

        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            }

        default:
            return state;

    }


}