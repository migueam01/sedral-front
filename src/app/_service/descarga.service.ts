import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Descarga } from '../_model/descarga';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DescargaService {
  descargaCambio = new Subject<Descarga[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${environment.HOST_URL}/v1/descargas`;

  constructor(private http: HttpClient) { }

  public listarTodos(): Observable<Descarga[]> {
    return this.http.get<Descarga[]>(this.url);
  }

  public listarPorId(idDescarga: number): Observable<Descarga> {
    return this.http.get<Descarga>(`${this.url}/${idDescarga}`);
  }

  public registrar(descarga: Descarga) {
    return this.http.post(`${this.url}`, descarga);
  }

  public modificar(descarga: Descarga) {
    return this.http.put(`${this.url}`, descarga);
  }

  public eliminar(idDescarga: number) {
    return this.http.delete(`${this.url}/${idDescarga}`);
  }
}