import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoginService } from './_service/login.service';
import { MenuService } from './_service/menu.service';
import { Menu } from './_model/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected title = 'sedral-front';

  isErrorPage = false;
  isLoginPage = false;

  menus: Menu[] = [];

  opened = true;
  seccionActual = '';

  constructor(private router: Router, public loginService: LoginService, private menuService: MenuService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateTitle(event.urlAfterRedirects);
      });
  }

  ngOnInit(): void {
    this.menuService.menuCambio.subscribe({
      next: (data) => {
        this.menus = data;
      }
    });
  }

  toggleSidenav(sidenav: any) {
    sidenav.toggle();
  }

  updateTitle(url: string) {
    this.isErrorPage = url.includes('error-');
    this.isLoginPage = url.includes('login');
    if (url.includes('pozo')) {
      this.seccionActual = 'RED DE ALCANTARILLADO SANITARIO - POZOS';
    } else if (url.includes('tuberia')) {
      this.seccionActual = 'RED DE ALCANTARILLADO SANITARIO - TUBERÍAS';
    } else if (url.includes('reporte')) {
      this.seccionActual = 'RED DE ALCANTARILLADO SANITARIO - REPORTES';
    } else if (url.includes('gadm')) {
      this.seccionActual = 'RED DE ALCANTARILLADO SANITARIO - GADM'
    } else if (url.includes('proyecto')) {
      this.seccionActual = 'RED DE ALCANTARILLADO SANITARIO - PROYECTO'
    } else if (url.includes('sector')) {
      this.seccionActual = 'RED DE ALCANTARILLADO SANITARIO - SECTOR'
    } else if (url.includes('descarga')) {
      this.seccionActual = 'RED DE ALCANTARILLADO SANITARIO - DESCARGA'
    } else if (url.includes('responsable')) {
      this.seccionActual = 'RED DE ALCANTARILLADO SANITARIO - RESPONSABLE'
    } else if (url.includes('dashboard')) {
      this.seccionActual = 'RED DE ALCANTARILLADO SANITARIO - DASHBOARD'
    } else if (url.includes('rol')) {
      this.seccionActual = 'RED DE ALCANTARILLADO SANITARIO - ROL'
    } else if (url.includes('mapa')) {
      this.seccionActual = '';
    } else if (url.includes('calculo')) {
      this.seccionActual = 'RED DE ALCANTARILLADO SANITARIO - CÁLCULOS HIDRÁULICOS'
    } else {
      this.seccionActual = ''
    }
  }

  cerrarSesion() {
    this.loginService.cerrarSesion();
    this.router.navigateByUrl('login', { replaceUrl: true });
  }
}