import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private userProfileSubject = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  updateUserProfile(profile: any) {
    this.userProfileSubject.next(profile);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  bio(form: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bio`, form);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.loggedIn.next(true);
      })
    );
  }

  // NUEVO MÉTODO AÑADIDO
  googleAuth(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/google`, { idToken }).pipe(
      tap(res => {
        // Guardamos el token y actualizamos el estado, igual que en el login normal
        localStorage.setItem('token', res.token);
        this.loggedIn.next(true);
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }
}
