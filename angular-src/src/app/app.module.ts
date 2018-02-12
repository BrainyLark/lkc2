import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterService } from './register.service';

import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './login.service';
import { ProfileComponent } from './profile/profile.component';
import { TaskComponent } from './task/task.component';
import { DomainComponent } from './domain/domain.component';
import { DomainService } from './domain.service';
import { TranslationComponent } from './translation/translation.component';
import { TranslationService } from './translation.service';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    TaskComponent,
    DomainComponent,
    TranslationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [RegisterService, LoginService, DomainService, TranslationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
