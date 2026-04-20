import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DBService {
  constructor(private http: HttpClient) {}

  getUsername(): Observable<{ user: string }> {
    return this.http.get<{ user: string }>('http://localhost:3000/api/user/1');
  }

  getDataName(): Observable<{ dataName: string }> {
    return this.http.get<{ dataName: string }>('http://localhost:3000/api/data/1');
  }

  getDataProgress(): Observable<{ dataProgress: string }> {
    return this.http.get<{ dataProgress: string }>('http://localhost:3000/api/data/1');
  }
}
