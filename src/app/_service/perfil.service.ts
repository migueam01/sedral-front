import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilDTO } from '../_model/perfil-dto';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  url: string = `${environment.HOST_URL}/v1/perfiles`;

  constructor(private http: HttpClient) { }

  public obtenerPerfil(idsPozos: number[]): Observable<PerfilDTO[]> {
    return this.http.post<PerfilDTO[]>(`${this.url}`, idsPozos);
  }
}