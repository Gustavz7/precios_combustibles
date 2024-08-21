import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }
  private baseUrl: string = "";

  doLogin(formValue: any) {
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/login`, formValue)
    )
  }

  doRegister(formValue: any) {
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/register`, formValue)
    )
  }
}
