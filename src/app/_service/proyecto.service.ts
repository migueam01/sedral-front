import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Proyecto } from '../_model/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  proyectoCambio = new Subject<Proyecto[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${environment.HOST_URL}/v1/proyectos`;

  constructor(private http: HttpClient) { }

  public listarTodos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.url);
  }

  public listarPorId(idProyecto: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.url}/${idProyecto}`);
  }

  public listarPorGadm(idGadm: number) {
    return this.http.get<Proyecto[]>(`${this.url}/gadms/${idGadm}`);
  }

  public registrar(proyecto: Proyecto) {
    return this.http.post(`${this.url}`, proyecto);
  }

  public modificar(proyecto: Proyecto) {
    return this.http.put(`${this.url}`, proyecto);
  }

  public eliminar(idProyecto: number) {
    return this.http.delete(`${this.url}/${idProyecto}`);
  }
}