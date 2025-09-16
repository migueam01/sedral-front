import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Responsable } from '../_model/responsable';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResponsableService {
  responsableCambio = new Subject<Responsable[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${environment.HOST_URL}/v1/responsables`;

  constructor(private http: HttpClient) { }

  public listarTodos(): Observable<Responsable[]> {
    return this.http.get<Responsable[]>(this.url);
  }

  public listarPorId(idResponsable: number): Observable<Responsable> {
    return this.http.get<Responsable>(`${this.url}/${idResponsable}`);
  }

  public registrar(responsable: Responsable) {
    return this.http.post(`${this.url}`, responsable);
  }

  public modificar(responsable: Responsable) {
    return this.http.put(`${this.url}`, responsable);
  }

  public eliminar(idResponsable: number) {
    return this.http.delete(`${this.url}/${idResponsable}`);
  }
}