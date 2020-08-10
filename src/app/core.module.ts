import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthenticationInterceptorService } from './authentication/authentication.interceptor.service';




@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptorService,
            multi: true
        }]
})
export class CoreModule { }