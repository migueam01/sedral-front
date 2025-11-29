import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../_model/menu';
import { MenuRequest } from '../_model/menu-request';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menuCambio = new Subject<Menu[]>();

  url: string = `${environment.HOST_URL}/v1/menus`;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Menu[]>(this.url);
  }

  listarPorUsuario(username: string) {
    const body: MenuRequest = { username };
    return this.http.post<any[]>(`${this.url}/usuario`, body);
  }
}