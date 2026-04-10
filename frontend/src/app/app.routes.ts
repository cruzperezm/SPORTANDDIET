import { Routes } from '@angular/router';
import {Login} from './pages/login/login'
import { Signup } from './pages/signup/signup';
import { HomeComponent } from './pages/Home/home.component'

export const routes: Routes = [
    {path: '', component: HomeComponent, title: 'SPORTS&DIET · Home'},
    {path: 'login', component: Login, title: 'SPORTS&DIET · Log In'},
    {path: 'signup', component: Signup, title: 'SPORTS&DIET · Sign Up'}
];
