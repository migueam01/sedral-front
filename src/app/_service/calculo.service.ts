import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CalculoHidraulico } from '../_model/calculo-hidraulico';

@Injectable({
  providedIn: 'root'
})
export class CalculoService {

  calculoCambio = new Subject<CalculoHidraulico[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${environment.HOST_URL}/v1/calculos`;

  constructor(private http: HttpClient) { }

  public obtenerCalculos(): Observable<CalculoHidraulico[]> {
    return this.http.get<CalculoHidraulico[]>(`${this.url}`);
  }

  public realizarCalculos(idProyecto: number) {
    return this.http.post(`${this.url}/${idProyecto}`, null);
  }
}