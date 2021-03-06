import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterService } from './register.service';
import { ExcerptFilter } from './filters/excerpt.filter';
import { TaskGuidelinesDialog, TaskGuidelinesDialogWindow } from './task-guidelines/task-guidelines-dialog';

import { FlexLayoutModule } from '@angular/flex-layout';

import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './login.service';
import { ProfileComponent } from './profile/profile.component';
import { TaskComponent } from './task/task.component';
import { DomainComponent } from './domain/domain.component';
import { DomainService } from './domain.service';
import { TranslationComponent } from './translation/translation.component';
import { TranslationService } from './translation.service';
import { TaskService } from './task.service';
import { ModificationComponent } from './modification/modification.component';
import { ModificationService } from './modification.service';
import { ValidationComponent } from './validation/validation.component';
import { ValidationService } from './validation.service';
import { ProjectComponent } from './project/project.component';

import {HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HomeComponent } from './home/home.component';
import { PublicationComponent } from './publication/publication.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { GlossTranslationComponent } from './gloss-translation/gloss-translation.component';
import { GlossModificationComponent } from './gloss-modification/gloss-modification.component';
import { GlossValidationComponent } from './gloss-validation/gloss-validation.component';
import { CookieService } from 'ngx-cookie-service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    TaskComponent,
    DomainComponent,
    TranslationComponent,
    ModificationComponent,
    ValidationComponent,
    ProjectComponent,
    HomeComponent,
    PublicationComponent,
    GuidelinesComponent,
    ResetPassComponent,
    GlossTranslationComponent,
    GlossModificationComponent,
    GlossValidationComponent,
    ExcerptFilter,
    TaskGuidelinesDialogWindow,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    RegisterService, 
    LoginService, 
    DomainService, 
    TranslationService, 
    TaskService, 
    ModificationService, 
    ValidationService, 
    TaskGuidelinesDialog, 
    CookieService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [TaskGuidelinesDialogWindow],
})
export class AppModule { }
