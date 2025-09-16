import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GadmComponent } from './pages/gadm/gadm.component';
import { GadmDialogoComponent } from './pages/gadm/gadm-dialogo/gadm-dialogo.component';
import { DescargaComponent } from './pages/descarga/descarga.component';
import { DescargaDialogoComponent } from './pages/descarga/descarga-dialogo/descarga-dialogo.component';
import { PozoComponent } from './pages/pozo/pozo.component';
import { PozoDialogoComponent } from './pages/pozo-dialogo/pozo-dialogo.component';
import { ProyectoComponent } from './pages/proyecto/proyecto.component';
import { ProyectoDialogoComponent } from './pages/proyecto/proyecto-dialogo/proyecto-dialogo.component';
import { ResponsableComponent } from './pages/responsable/responsable.component';
import { ResponsableDialogoComponent } from './pages/responsable/responsable-dialogo/responsable-dialogo.component';
import { SectorComponent } from './pages/sector/sector.component';
import { SectorDialogoComponent } from './pages/sector-dialogo/sector-dialogo.component';
import { TuberiaComponent } from './pages/tuberia/tuberia.component';
import { TuberiaDialogoComponent } from './pages/tuberia-dialogo/tuberia-dialogo.component';
import { MapaComponent } from './pages/mapa/mapa.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardTuberiasComponent } from './pages/dashboard-tuberias/dashboard-tuberias.component';
import { DashboardPozosComponent } from './pages/dashboard-pozos/dashboard-pozos.component';

const routes: Routes = [
  {
    path: "gadm", component: GadmComponent, children: [
      { path: 'nuevo', component: GadmDialogoComponent },
      { path: 'edicion/:idGadm', component: GadmDialogoComponent }
    ]
  },
  {
    path: "descarga", component: DescargaComponent, children: [
      { path: 'nuevo', component: DescargaDialogoComponent },
      { path: 'edicion/:idDescarga', component: DescargaDialogoComponent }
    ]
  },
  { path: "pozo", component: PozoComponent },
  { path: "pozo-nuevo", component: PozoDialogoComponent },
  { path: "pozo-edicion/:idPozo", component: PozoDialogoComponent },
  { path: "proyecto", component: ProyectoComponent },
  { path: "proyecto-nuevo", component: ProyectoDialogoComponent },
  { path: "proyecto-edicion/:idProyecto", component: ProyectoDialogoComponent },
  {
    path: "responsable", component: ResponsableComponent, children: [
      { path: 'nuevo', component: ResponsableDialogoComponent },
      { path: 'edicion/:idResponsable', component: ResponsableDialogoComponent }
    ]
  },
  { path: "sector", component: SectorComponent },
  { path: "sector-nuevo", component: SectorDialogoComponent },
  { path: "sector-edicion/:idSector", component: SectorDialogoComponent },
  { path: "tuberia", component: TuberiaComponent },
  { path: "tuberia-nuevo", component: TuberiaDialogoComponent },
  { path: "tuberia-edicion/:idTuberia", component: TuberiaDialogoComponent },
  { path: "mapa", component: MapaComponent },
  {
    path: "dashboard", component: DashboardComponent, children: [
      { path: "resumen-tub", component: DashboardTuberiasComponent },
      { path: "resumen-pz", component: DashboardPozosComponent }
    ]
  },
  { path: '', redirectTo: '/mapa', pathMatch: 'full' },
  { path: '**', redirectTo: '/mapa' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
