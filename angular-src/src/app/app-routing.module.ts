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

const routes: Routes = [
	{ path: 'register', component: RegisterComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'profile', component: ProfileComponent },
	{ path: 'task', component: TaskComponent },
	{ path: 'task/:id', component: DomainComponent },
	{ path: 'task/1/:gid', component: TranslationComponent },
	{ path: 'task/2/:gid', component: ModificationComponent },
	{ path: 'task/3/:gid', component: ValidationComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})

export class AppRoutingModule { }
