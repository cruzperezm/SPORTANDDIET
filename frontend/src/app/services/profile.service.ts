import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api/profile';

  constructor(private http: HttpClient) {}

  getProfile() {
    const userId = localStorage.getItem('userId') || '1';

    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  updateProfile(profileData: any) {
    const userId = localStorage.getItem('userId') || '1';

    return this.http.put(`${this.apiUrl}/${userId}`, profileData);
  }
}
