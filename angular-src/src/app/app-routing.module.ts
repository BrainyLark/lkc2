import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { TaskComponent } from './task/task.component';
import { DomainComponent } from './domain/domain.component';
import { TranslationComponent } from './translation/translation.component';
import { ModificationComponent } from './modification/modification.component';
import { ValidationComponent } from './validation/validation.component';
import { GlossTranslationComponent } from './gloss-translation/gloss-translation.component';
import { GlossModificationComponent } from './gloss-modification/gloss-modification.component';
import { GlossValidationComponent } from './gloss-validation/gloss-validation.component';
import { ProjectComponent } from './project/project.component';
import { HomeComponent } from './home/home.component';
import { PublicationComponent } from './publication/publication.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'profile', component: ProfileComponent },
	{ path: 'task', component: TaskComponent },
	{ path: 'task/:id', component: DomainComponent },
	{ path: 'task/1/:gid', component: TranslationComponent },
	{ path: 'task/2/:gid', component: ModificationComponent },
	{ path: 'task/3/:gid', component: ValidationComponent },
	{ path: 'task/4/:gid', component: GlossTranslationComponent },
	{ path: 'task/5/:gid', component: GlossModificationComponent },
	{ path: 'task/6/:gid', component: GlossValidationComponent },
	{ path: 'project', component: ProjectComponent },
	{ path: 'publications', component: PublicationComponent },
	{ path: 'guidelines', component: GuidelinesComponent },
	{ path: 'resetpass', component: ResetPassComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})

export class AppRoutingModule { }
