import { Routes } from '@angular/router';
import {Login} from './pages/login/login'
import { Signup } from './pages/signup/signup';
import { HomeComponent } from './pages/Home/home.component'
import {Bio} from './pages/biodata/bio'

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: Login},
    {path: 'signup', component: Signup},
    {path: 'bio', component: Bio}
];
