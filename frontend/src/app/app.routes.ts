import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { HomeComponent } from './pages/Home/home.component';
import { Bio } from './pages/biodata/bio';
import { DietasInicioComponent } from './pages/dietas/dietas-inicio/dietas-inicio';
import { DietasPlanComponent } from './pages/dietas/dietas-plan/dietas-plan';
import { DietaDetalleComponent } from './pages/dietas/dietas-detalle/dietas-detalle';
import { DeportesInicioComponent } from './pages/deportes/deportes-inicio/deportes-inicio';
import { DeportePlanComponent } from './pages/deportes/deportes-plan/deportes-plan';
import { DeportesDetalleComponent } from './pages/deportes/deportes-detalle/deportes-detalle';

export const routes: Routes = [
  { path: 'login', component: Login, title: 'SPORTS&DIET · Log In' },
  { path: 'signup', component: Signup, title: 'SPORTS&DIET · Sign Up' },
  { path: 'bio', component: Bio, title: 'SPORTS&DIET · Bio Data' },
  { path: 'dietas', component: DietasInicioComponent, title: 'SPORTS&DIET · Dietas' },
  { path: 'dietas/plan/:id', component: DietasPlanComponent, title: 'SPORTS&DIET · Plan' },
  { path: 'dietas/receta/:id', component: DietaDetalleComponent, title: 'SPORTS&DIET · Receta' },
  { path: 'home', component: HomeComponent, title: 'SPORTS&DIET · Home' },
  { path: 'deporte', component: DeportesInicioComponent, title: 'SPORTS&DIET · Deportes' },
  { path: 'deporte/plan/:id', component: DeportePlanComponent, title: 'SPORTS&DIET · Entrenamientos' },
  { path: 'deporte/ejercicio/:id', component: DeportesDetalleComponent, title: 'SPORTS&DIET · Ejercicio' },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
