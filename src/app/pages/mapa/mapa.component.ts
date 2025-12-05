import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-arrowheads';
import { PozoService } from '../../_service/pozo.service';
import { TuberiaService } from '../../_service/tuberia.service';
import { PozoMapa } from '../../_model/pozo-mapa';
import Swal from 'sweetalert2';
import { TuberiaMapa } from '../../_model/tuberia-mapa';
import { MatDialog } from '@angular/material/dialog';
import { PerfilComponent } from '../perfil/perfil.component';

@Component({
  selector: 'app-mapa',
  standalone: false,
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements AfterViewInit, OnInit, OnDestroy {

  private map!: L.Map;
  private pozosLayer: L.LayerGroup = L.layerGroup();
  private tuberiasLayer: L.LayerGroup = L.layerGroup();

  private pozoMarkers: Map<number, L.CircleMarker> = new Map();
  private labelMarkers: L.Marker[] = [];

  private tuberiaPolylines: L.Polyline[] = [];

  pozos: PozoMapa[] = [];
  tuberias: TuberiaMapa[] = [];

  private readonly TUBERIA_ANCHO = 3;
  private readonly FLECHA_TAMANO = '15px';

  modoSeleccion = false;
  private pozosSeleccionados: any[] = [];
  constructor(private pozoService: PozoService, private tuberiaService: TuberiaService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [0.800366, -77.853904],
      zoom: 15,
      minZoom: 2,
      maxZoom: 22,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 22,
      attribution: '© OpenStreetMap contributors'
      //attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    L.control.scale().addTo(this.map);

    // Agregar layers groups al mapa
    this.pozosLayer.addTo(this.map);
    this.tuberiasLayer.addTo(this.map);

    // Control de layers
    const baseMaps = {
      'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    };

    const overlayMaps = {
      'Pozos': this.pozosLayer,
      'Tuberías': this.tuberiasLayer
    };

    L.control.layers(baseMaps, overlayMaps).addTo(this.map);
  }

  private cargarDatos(): void {
    //Cargar pozos
    this.pozoService.listarPozosMapa().subscribe({
      next: (pozos) => {
        this.pozos = pozos;
        this.dibujarPozos(pozos);
      }, error: (error) => {
        Swal.fire({
          title: "INFO",
          text: "Error al cargar los pozos",
          icon: "error"
        });
      }
    });

    //Cargar tuberías
    this.tuberiaService.listarTuberiasMapa().subscribe({
      next: (tuberias) => {
        this.tuberias = tuberias;
        this.dibujarTuberias(tuberias);
      },
      error: (error) => {
        Swal.fire({
          title: "INFO",
          text: "Error al cargar las tuberías",
          icon: "error"
        });
      }
    });
  }

  private dibujarPozos(pozos: PozoMapa[]): void {
    // Limpiar layer anterior
    this.pozosLayer.clearLayers();
    this.clearLabelMarkers();
    this.pozoMarkers.clear();
    this.pozosSeleccionados = [];

    pozos.forEach(pozo => {
      if (pozo.latitud && pozo.longitud) {
        // Crear círculo en lugar de marcador
        const circle = L.circleMarker([pozo.latitud, pozo.longitud], {
          radius: 6, // Radio en metros
          color: '#0066cc',  // Color del borde
          weight: 2,  // Grosor del borde
          opacity: 0.8,  // Opacidad del borde
          fillColor: '#3399ff',  // Color de relleno
          fillOpacity: 0.6  // Opacidad del relleno
        });

        // Popup con información del pozo
        const popupContent = `
          <div class="popup-content">
            <h4>Pozo #${pozo.idPozo}</h4>
            <p><strong>Nombre:</strong> ${pozo.nombre || 'N/A'}</p>
            <p><strong>Estado:</strong> ${pozo.estado || 'N/A'}</p>
            <p><strong>Coordenadas:</strong><br>
            Lat: ${pozo.latitud.toFixed(6)}<br>
            Lon: ${pozo.longitud.toFixed(6)}</p>
          </div>
        `;

        circle.bindPopup(popupContent);
        circle.on('click', (ev) => {
          if (this.modoSeleccion) {
            this.toggleSeleccionPozo(pozo, circle);
          } else {
            circle.openPopup();
          }
        });
        circle.addTo(this.pozosLayer);
        this.pozoMarkers.set(pozo.idPozo, circle);
      }
    });

    // Ajustar el zoom para mostrar todos los pozos
    /*if (this.pozoMarkers.length > 0) {
      const bounds = this.calculateMarkerBounds(this.pozoMarkers);
      this.map.fitBounds(bounds, { padding: [50, 50] });
    } quitado*/
  }

  private dibujarTuberias(tuberias: TuberiaMapa[]): void {
    // Limpiar layer anterior
    this.tuberiasLayer.clearLayers();
    this.tuberiaPolylines = [];

    tuberias.forEach(tuberia => {
      if (tuberia.coordenadas && tuberia.coordenadas.length >= 2) {
        // Convertir coordenadas a formato [lat, lng] para Leaflet
        const latLngs = tuberia.coordenadas.map(coord =>
          [coord.latitud, coord.longitud] as L.LatLngExpression
        );

        const polyline = L.polyline(latLngs, {
          color: 'green',
          weight: this.TUBERIA_ANCHO,
          opacity: 0.8
        }).arrowheads({
          yawn: 30,  // Ángulo para la flecha
          size: this.FLECHA_TAMANO,
          fill: true,
          frequency: 'endonly',
          proportionalToTotal: false,
          offsets: {
            end: '0px'
          },
          fillOpacity: 0.9,
          stroke: true
        });

        // Popup con información de la tubería
        const popupContent = `
          <div class="popup-content">
            <h4>Tubería #${tuberia.idTuberia}</h4>
            <p><strong>Material:</strong> ${tuberia.material || 'N/A'}</p>
            <p><strong>Diámetro:</strong> ${tuberia.diametro || 'N/A'} mm</p>
            <p><strong>Funciona:</strong> ${tuberia.funciona || 'N/A'}</p>
            <p><strong>Pendiente:</strong> ${tuberia.pendiente}</p>
            <p><strong>Velocidad:</strong> ${tuberia.velocidad} m/s</p>
            <p><strong>Caudal:</strong> ${tuberia.caudal} l/s</p>
          </div>
        `;

        polyline.bindPopup(popupContent);
        polyline.on('click', () => {
          if (this.modoSeleccion) {
            polyline.openPopup();
          }
        })
        polyline.addTo(this.tuberiasLayer);
        this.tuberiaPolylines.push(polyline); // Guardar referencia
      }
    });
  }

  private toggleSeleccionPozo(pozo: PozoMapa, marker: L.CircleMarker): void {
    const indice = this.pozosSeleccionados.indexOf(pozo.idPozo);
    if (indice === -1) {
      this.pozosSeleccionados.push(pozo.idPozo);
      marker.setStyle({ color: 'red', fillColor: '#ff6666' });
      this.addOrderLabel(marker.getLatLng(), this.pozosSeleccionados.length);
    } else {
      this.pozosSeleccionados.splice(indice, 1);
      marker.setStyle({ color: '#0066cc', fillColor: '#3399ff' })
      this.redrawOrderLabels();
    }
  }

  private addOrderLabel(latLng: L.LatLng, order: number): void {
    const label = L.divIcon({
      className: 'pozo-order-label',
      html: `<div class="label-circle">${order}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    const m = L.marker(latLng, { icon: label, interactive: false }).addTo(this.map);
    this.labelMarkers.push(m);
  }

  private clearLabelMarkers(): void {
    this.labelMarkers.forEach(m => m.remove());
    this.labelMarkers = [];
  }

  private redrawOrderLabels(): void {
    this.clearLabelMarkers();
    this.pozosSeleccionados.forEach((id, indice) => {
      const marker = this.pozoMarkers.get(id);
      if (marker) {
        this.addOrderLabel(marker.getLatLng(), indice + 1);
      }
    });

    this.pozoMarkers.forEach((marker, id) => {
      if (!this.pozosSeleccionados.includes(id)) {
        marker.setStyle({ color: '#0066cc', fillColor: '#3399ff' });
      } else {
        marker.setStyle({ color: 'red', fillColor: '#ff6666' });
      }
    });
  }

  activarSeleccion(): void {
    this.modoSeleccion = true;
    this.pozosSeleccionados = [];
    Swal.fire('Modo selección activado', 'Haz clic en los pozos para el perfil hidráulico', 'info');
  }

  cancelarSeleccion(): void {
    this.modoSeleccion = false;
    this.pozosSeleccionados = [];
    this.clearLabelMarkers();

    this.pozoMarkers.forEach(marker => marker.setStyle({ color: '#0066cc', fillColor: '#3399ff' }));
  }

  abrirPerfil(): void {
    if (this.pozosSeleccionados.length < 2) {
      Swal.fire('Advertencia', 'Seleccione al menos dos pozos', 'warning');
      return;
    }
    console.log('Lista de pozos en el mapa ' + this.pozosSeleccionados);

    this.dialog.open(PerfilComponent, {
      width: '95vw',
      height: '85vh',
      maxWidth: '1200px',
      maxHeight: '800px',
      panelClass: 'large-perfil-dialog',
      data: { idsPozos: this.pozosSeleccionados }
    });

    this.cancelarSeleccion();
  }

  // Método para calcular bounds de markers
  private calculateMarkerBounds(markers: L.Marker[]): L.LatLngBounds {
    const bounds = L.latLngBounds([]);
    markers.forEach(marker => {
      bounds.extend(marker.getLatLng());
    });
    return bounds;
  }

  // Método para calcular bounds de polylines
  private calculatePolylineBounds(polylines: L.Polyline[]): L.LatLngBounds {
    const bounds = L.latLngBounds([]);
    polylines.forEach(polyline => {
      bounds.extend(polyline.getBounds());
    });
    return bounds;
  }

  // Método para calcular bounds de todos los layers
  private calculateAllBounds(): L.LatLngBounds {
    const bounds = L.latLngBounds([]);

    // Extender con markers de pozos
    this.pozoMarkers.forEach(marker => {
      bounds.extend(marker.getLatLng());
    });

    // Extender con polylines de tuberías
    this.tuberiaPolylines.forEach(polyline => {
      bounds.extend(polyline.getBounds());
    });

    return bounds;
  }

  private createPozoIcon(estado: string): L.Icon {
    let color = 'orange';

    switch (estado?.toLowerCase()) {
      case 'Bueno':
        color = 'green';
        break;
      case 'Regular':
        color = 'yellow';
        break;
      case 'Malo':
        color = 'red';
        break;
      default:
        color = 'orange';
    }

    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  private getColorByMaterial(material: string): string {
    switch (material?.toLowerCase()) {
      case 'PVC': return 'blue';
      case 'HS': return 'gray';
      case 'HA': return 'orange';
      case 'Otros': return 'green';
      default: return 'red';
    }
  }

  private getWeightByDiametro(diametro: number): number {
    if (!diametro) return 3;
    return Math.min(8, Math.max(2, diametro / 50));
  }

  // Métodos públicos para controlar las capas
  togglePozosLayer(visible: boolean): void {
    if (visible) {
      this.map.addLayer(this.pozosLayer);
    } else {
      this.map.removeLayer(this.pozosLayer);
    }
  }

  toggleTuberiasLayer(visible: boolean): void {
    if (visible) {
      this.map.addLayer(this.tuberiasLayer);
    } else {
      this.map.removeLayer(this.tuberiasLayer);
    }
  }

  /*fitToPozos(): void {
    if (this.pozoMarkers.length > 0) {
      const bounds = this.calculateMarkerBounds(this.pozoMarkers);
      this.map.fitBounds(bounds, { padding: [20, 20] });
    }
  }

  fitToTuberias(): void {
    if (this.tuberiaPolylines.length > 0) {
      const bounds = this.calculatePolylineBounds(this.tuberiaPolylines);
      this.map.fitBounds(bounds, { padding: [20, 20] });
    }
  }

  fitToAll(): void {
    if (this.pozoMarkers.length > 0 || this.tuberiaPolylines.length > 0) {
      const bounds = this.calculateAllBounds();
      this.map.fitBounds(bounds, { padding: [20, 20] });
    }
  }*/
}