import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Sector } from '../_model/sector';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  sectorCambio = new Subject<Sector[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${environment.HOST_URL}/v1/sectores`;

  constructor(private http: HttpClient) { }

  public listarTodos(): Observable<Sector[]> {
    return this.http.get<Sector[]>(this.url);
  }

  public listarPorId(idSector: number): Observable<Sector> {
    return this.http.get<Sector>(`${this.url}/${idSector}`);
  }

  public listarPorProyecto(idProyecto: number) {
    return this.http.get<Sector[]>(`${this.url}/proyectos/${idProyecto}`);
  }

  public registrar(sector: Sector) {
    return this.http.post(`${this.url}`, sector);
  }

  public modificar(sector: Sector) {
    return this.http.put(`${this.url}`, sector);
  }

  public eliminar(idSector: number) {
    return this.http.delete(`${this.url}/${idSector}`);
  }
}