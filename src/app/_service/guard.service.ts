import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { MenuService } from './menu.service';
import { Menu } from '../_model/menu';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  private helper = new JwtHelperService();

  constructor(private loginService: LoginService, private router: Router, private menuService: MenuService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let rpta = this.loginService.estaLogueado();
    if (!rpta) {
      sessionStorage.clear();
      this.router.navigateByUrl('login', { replaceUrl: true });
      return false;
    } else {
      const token = sessionStorage.getItem(environment.TOKEN_NAME);
      const usuarioToken = this.loginService.obtenerUsuario();
      if (!this.helper.isTokenExpired(token)) {
        let url = state.url;

        return this.menuService.listarPorUsuario(usuarioToken).pipe(map((data: Menu[]) => {
          this.menuService.menuCambio.next(data);

          let cont = 0;
          for (let m of data) {
            if (m.url === url) {
              cont++;
              break;
            }
          }

          if (cont > 0) {
            return true;
          } else {
            this.router.navigate(['error-401']);
            return false;
          }
        }));
      } else {
        sessionStorage.removeItem(environment.TOKEN_NAME);
        this.router.navigateByUrl('login', { replaceUrl: true });
        return false;
      }
    }
  }
}