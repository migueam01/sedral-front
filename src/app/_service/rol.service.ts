import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Rol } from '../_model/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  rolCambio = new Subject<Rol[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${environment.HOST_URL}/v1/roles`;

  constructor(private http: HttpClient) { }

  public listarTodos(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url);
  }

  public listarPorId(idRol: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${idRol}`);
  }

  public registrar(rol: Rol) {
    return this.http.post(`${this.url}`, rol);
  }

  public modificar(rol: Rol) {
    return this.http.put(`${this.url}`, rol);
  }

  public eliminar(idRol: number) {
    return this.http.delete(`${this.url}/${idRol}`);
  }
}