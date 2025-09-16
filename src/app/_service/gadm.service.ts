import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Gadm } from '../_model/gadm';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GadmService {
  gadmCambio = new Subject<Gadm[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${environment.HOST_URL}/v1/gadms`;

  constructor(private http: HttpClient) { }

  public listarTodos(): Observable<Gadm[]> {
    return this.http.get<Gadm[]>(this.url);
  }

  public listarPorId(idGadm: number): Observable<Gadm> {
    return this.http.get<Gadm>(`${this.url}/${idGadm}`);
  }

  public registrar(gadm: Gadm) {
    return this.http.post(`${this.url}`, gadm);
  }

  public modificar(gadm: Gadm) {
    return this.http.put(`${this.url}`, gadm);
  }

  public eliminar(idGadm: number) {
    return this.http.delete(`${this.url}/${idGadm}`);
  }
}