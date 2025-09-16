import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected title = 'sedral-front';

  opened = true;
  seccionActual = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateTitle(event.urlAfterRedirects);
      });
  }

  toggleSidenav(sidenav: any) {
    sidenav.toggle();
  }

  updateTitle(url: string) {
    if (url.includes('pozo')) {
      this.seccionActual = 'POZOS';
    } else if (url.includes('tuberia')) {
      this.seccionActual = 'TUBERÍAS';
    } else if (url.includes('reporte')) {
      this.seccionActual = 'REPORTES';
    } else if (url.includes('gadm')) {
      this.seccionActual = 'GADM'
    } else if (url.includes('proyecto')) {
      this.seccionActual = 'PROYECTO'
    } else if (url.includes('sector')) {
      this.seccionActual = 'SECTOR'
    } else if (url.includes('descarga')) {
      this.seccionActual = 'DESCARGA'
    } else if (url.includes('responsable')) {
      this.seccionActual = 'RESPONSABLE'
    } else if (url.includes('dashboard')) {
      this.seccionActual = 'DASHBOARD'
    } else {
      this.seccionActual = 'MAPA';
    }
  }
}