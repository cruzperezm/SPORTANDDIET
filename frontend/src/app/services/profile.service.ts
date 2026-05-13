import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from './../pages/profile/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api/profile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl);
  }

  updateProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, profileData);
  }
}
