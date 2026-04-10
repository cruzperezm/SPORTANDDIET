import { Routes } from '@angular/router';
import {Login} from './pages/login/login'
import { Signup } from './pages/signup/signup';
import { HomeComponent } from './pages/Home/home.component'
import { LoginSuccessComponent } from './pages/login/login-success/login-success';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: Login},
    {path: 'signup', component: Signup},
    { path: 'login-success', component: LoginSuccessComponent },
];
