import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';



@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // @ViewChild('nameInput') ingredientNameInput: ElementRef;
  // @ViewChild('amountInput') ingredientAmountInput: ElementRef;
  // @Output() ingredientAdded = new EventEmitter<Ingredient>();
  @ViewChild('ingredientForm') slForm: NgForm;
  subscription: Subscription;
  editIedtemIngredientIndex: number;
  editMode = false;
  editedIngredientItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedIngredientItem = stateData.editedIngredient;
        this.editIedtemIngredientIndex = stateData.editedIngredientIndex;
        this.slForm.setValue({
          name: this.editedIngredientItem.name,
          amount: this.editedIngredientItem.amount
        });
      } else {
        this.editMode = false;
      }
    });

  }

  onSubmit(ingredientForm: NgForm) {
   
    const value = ingredientForm.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode === true) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    ingredientForm.reset();
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

}
