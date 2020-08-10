import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer'
import * as recipeActions from '../store/recipe.actions'
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.action'
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  //  @Input() recipeSelectToDetail: Recipe; /** this is the old way for routing */
  recipeSelectToDetail: Recipe;
  id: number;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.pipe(map(params => {
      return +params['id'];
      /** we used (switchMap) to switch our observable from route observable to store observable */
    }), switchMap(id => { 
      this.id = id;
      return this.store.select('recipes');
    }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      })).subscribe(recipe => {
        this.recipeSelectToDetail = recipe;
      });
  }

  onAddIngredientsToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipeSelectToDetail.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new recipeActions.DeleteeRecipe(this.id));
    this.router.navigate(['/recipes'])
  }

}
