import { Component, OnInit, OnDestroy } from '@angular/core';
import {  Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.action';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: []
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // ingredients: Ingredient[];
  // private ingredientChangedSubscirption: Subscription;
  ingredients: Observable<{ingredients: Ingredient[]}>;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditIngredientItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }

  ngOnDestroy() {
  }
}
