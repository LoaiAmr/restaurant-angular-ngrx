import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from './store/app.reducer';
import * as AuthActions from './authentication/store/authentication.actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'restaurant-angular-tutorial';

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {

    /** if the user is logged in it keep it logged until he logout */
    this.store.dispatch(new AuthActions.AutoLogin());

  }

}
