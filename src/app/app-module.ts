import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { DescargaComponent } from './pages/descarga/descarga.component';
import { GadmComponent } from './pages/gadm/gadm.component';
import { MapaComponent } from './pages/mapa/mapa.component';
import { PozoComponent } from './pages/pozo/pozo.component';
import { PozoDialogoComponent } from './pages/pozo-dialogo/pozo-dialogo.component';
import { ProyectoComponent } from './pages/proyecto/proyecto.component';
import { ResponsableComponent } from './pages/responsable/responsable.component';
import { SectorComponent } from './pages/sector/sector.component';
import { SectorDialogoComponent } from './pages/sector-dialogo/sector-dialogo.component';
import { TuberiaComponent } from './pages/tuberia/tuberia.component';
import { TuberiaDialogoComponent } from './pages/tuberia-dialogo/tuberia-dialogo.component';
import { DescargaDialogoComponent } from './pages/descarga/descarga-dialogo/descarga-dialogo.component';
import { GadmDialogoComponent } from './pages/gadm/gadm-dialogo/gadm-dialogo.component';
import { ProyectoDialogoComponent } from './pages/proyecto/proyecto-dialogo/proyecto-dialogo.component';
import { ResponsableDialogoComponent } from './pages/responsable/responsable-dialogo/responsable-dialogo.component';
import { MaterialModule } from "./material/material.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardTuberiasComponent } from './pages/dashboard-tuberias/dashboard-tuberias.component';
import { DashboardPozosComponent } from './pages/dashboard-pozos/dashboard-pozos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

@NgModule({
  declarations: [
    App,
    DescargaComponent,
    GadmComponent,
    MapaComponent,
    PozoComponent,
    PozoDialogoComponent,
    ProyectoComponent,
    ResponsableComponent,
    SectorComponent,
    SectorDialogoComponent,
    TuberiaComponent,
    TuberiaDialogoComponent,
    DescargaDialogoComponent,
    GadmDialogoComponent,
    ProyectoDialogoComponent,
    ResponsableDialogoComponent,
    DashboardComponent,
    DashboardTuberiasComponent,
    DashboardPozosComponent,
    PerfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ],
  bootstrap: [App]
})
export class AppModule { }