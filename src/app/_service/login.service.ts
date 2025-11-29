import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: string = `${environment.HOST_URL}/v1/auth/login`;

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(this.url, credentials);
  }

  estaLogueado() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  cerrarSesion() {
    sessionStorage.removeItem(environment.TOKEN_NAME);
  }

  obtenerUsuario() {
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    if (!token) {
      return null;
    }
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.sub || null;
  }
}