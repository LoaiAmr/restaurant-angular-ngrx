import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import {  Subscription } from 'rxjs';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer'
import * as AuthActions from '../store/authentication.actions'

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoadingMode = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  private closeSub: Subscription;
  private storeSub: Subscription;


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    /**it is way when using ngrx */
    this.storeSub = this.store.select('authReducer').subscribe(authState => {
      this.isLoadingMode = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }


  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }


  onSubmit(form: NgForm) {

    /** if the hacker inturrept the [disabled] button from the frontend so it secured it in backend
     * by using if statement
     */
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    this.isLoadingMode = true;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email: email, password: password }));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({ email: email, password: password }));
    }


    form.reset();
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }




  private showErrorAlert(messageError: string) {
    /** if we need to create object from component we don't use 
     * const alertComponent = new AlertComponent(); ====> this is false in angular
     */
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

    componentRef.instance.messageError = messageError;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });

  }

}
