import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AppComponent } from './app.component';
import { headerComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing-module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import * as fromApp from './store/app.reducer'
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationEffects } from './authentication/store/authentication.effects';
import { environment } from '../environments/environment';
import { RecipeEffects } from './recipes/store/recipe.effects';





@NgModule({
  declarations: [
    AppComponent,
    headerComponent,
  ],
  imports: [
    // Add .withServerTransition() to support Universal rendering.
    // The application ID can be any identifier which is unique on
    // the page.
    BrowserModule.withServerTransition({appId: 'my-app'}), /** it can use once in the whole of application to access ngFor and ngIf */
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthenticationEffects, RecipeEffects]),

    /** this is tool is using for ngrx in redux tool in your broswer to see your application states with ngrx */
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    StoreRouterConnectingModule.forRoot(),
    
    SharedModule,   
    CoreModule
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
