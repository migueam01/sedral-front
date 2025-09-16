import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Tuberia } from '../_model/tuberia';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { TuberiaMapa } from '../_model/tuberia-mapa';
import { ConsultaTuberia } from '../_model/consulta-tuberia';
import { RangoLongitud } from '../_model/rango-longitud';

@Injectable({
  providedIn: 'root'
})
export class TuberiaService {
  tuberiaCambio = new Subject<Tuberia[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${environment.HOST_URL}/v1/tuberias`;

  constructor(private http: HttpClient) { }

  public listarTodos(): Observable<Tuberia[]> {
    return this.http.get<Tuberia[]>(this.url);
  }

  public listarTuberiasMapa(): Observable<TuberiaMapa[]> {
    return this.http.get<TuberiaMapa[]>(`${this.url}/mapas`);
  }

  public listarPorId(idTuberia: number): Observable<Tuberia> {
    return this.http.get<Tuberia>(`${this.url}/${idTuberia}`);
  }

  public listarPorPozoInicio(idPozo: number) {
    return this.http.get<Tuberia[]>(`${this.url}/pozos/${idPozo}`);
  }

  public registrar(tuberia: Tuberia) {
    return this.http.post(`${this.url}`, tuberia);
  }

  public modificar(tuberia: Tuberia) {
    return this.http.put(`${this.url}`, tuberia);
  }

  public eliminar(idTuberia: number) {
    return this.http.delete(`${this.url}/${idTuberia}`);
  }

  //Servicios para dashboard
  public obtenerTotalTuberias(): Observable<number> {
    return this.http.get<number>(`${this.url}/totales`);
  }

  public obtenerSumaLongitudes(): Observable<number> {
    return this.http.get<number>(`${this.url}/suma-longitudes`);
  }

  public listarPorFuncionamiento(): Observable<ConsultaTuberia[]> {
    return this.http.get<ConsultaTuberia[]>(`${this.url}/funcionamientos`);
  }

  public listarPorDiametro(): Observable<ConsultaTuberia[]> {
    return this.http.get<ConsultaTuberia[]>(`${this.url}/diametros`);
  }

  public listarPorMaterial(): Observable<ConsultaTuberia[]> {
    return this.http.get<ConsultaTuberia[]>(`${this.url}/materiales`);
  }

  public listarPorRangoLongituid(): Observable<RangoLongitud[]> {
    return this.http.get<RangoLongitud[]>(`${this.url}/rangos-longitud`);
  }
}