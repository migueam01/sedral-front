import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Pozo } from '../_model/pozo';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PozoMapa } from '../_model/pozo-mapa';
import { CantidadPozo } from '../_model/cantidad-pozo';
import { StatsAlturaPozo } from '../_model/stats-altura-pozos';

@Injectable({
  providedIn: 'root'
})
export class PozoService {

  pozoCambio = new Subject<Pozo[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${environment.HOST_URL}/v1/pozos`;

  constructor(private http: HttpClient) { }

  public listarTodos(): Observable<Pozo[]> {
    return this.http.get<Pozo[]>(this.url);
  }

  public listarPozosMapa(): Observable<PozoMapa[]> {
    return this.http.get<PozoMapa[]>(`${this.url}/mapas`);
  }

  public listarPorId(idPozo: number): Observable<Pozo> {
    return this.http.get<Pozo>(`${this.url}/${idPozo}`);
  }

  public registrar(pozo: Pozo) {
    return this.http.post(`${this.url}`, pozo);
  }

  public modificar(pozo: Pozo) {
    return this.http.put(`${this.url}`, pozo);
  }

  public eliminar(idPozo: number) {
    return this.http.delete(`${this.url}/${idPozo}`);
  }

  //Servicios para dashboard
  public obtenerTotalPozos(): Observable<number> {
    return this.http.get<number>(`${this.url}/totales`);
  }

  public listarStatsAltura(): Observable<StatsAlturaPozo[]> {
    return this.http.get<StatsAlturaPozo[]>(`${this.url}/stats`);
  }

  public listarPorEstado(): Observable<CantidadPozo[]> {
    return this.http.get<CantidadPozo[]>(`${this.url}/estados`);
  }

  public listarPorTapados(): Observable<CantidadPozo[]> {
    return this.http.get<CantidadPozo[]>(`${this.url}/tapados`);
  }

  public listarPorCalzada(): Observable<CantidadPozo[]> {
    return this.http.get<CantidadPozo[]>(`${this.url}/calzadas`);
  }
}