import { ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PerfilService } from '../../_service/perfil.service';
import { PerfilDTO } from '../../_model/perfil-dto';
import {
  Chart,
  ChartConfiguration,
  ChartOptions,
  registerables
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables);
Chart.register(zoomPlugin);

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit, OnDestroy {

  perfiles: PerfilDTO[] = [];
  chart: Chart | null = null;
  isZoomed: boolean = false;
  private originalYMin: number = 0;
  private originalYMax: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private perfileService: PerfilService,
    private dialogRef: MatDialogRef<PerfilComponent>, private cdRef: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const canvas = document.getElementById('perfilCanvas');
    if (canvas && !canvas.contains(event.target as Node)) {
      this.ocultarTooltip();
    }
  }

  private ocultarTooltip(): void {
    if (this.chart) {
      (this.chart as any).tooltip?.setActiveElements([], { x: 0, y: 0 });
      (this.chart as any).tooltip.opacity = 0;
      this.chart.update('none');
    }
  }

  resetZoom(): void {
    if (this.chart) {
      this.chart.resetZoom();
      this.isZoomed = false;
    }
  }

  ngOnInit(): void {
    console.log('Ids recibidos desde el mapa ' + this.data.idsPozos);
    this.cargarPerfil();
  }

  private cargarPerfil(): void {
    this.perfileService.obtenerPerfil(this.data.idsPozos).subscribe({
      next: (response: PerfilDTO[]) => {
        this.perfiles = response;
        console.log('Datos del perfil recibidos del backend', this.perfiles);
        this.dibujarPerfil();
      }, error: (err) => {
        console.error('Error al obtener el perfil desde el backend: ', err);
      }
    });
  }

  private dibujarPerfil(): void {
    const nombresPozos: string[] = [];
    const cotaTerreno: number[] = [];
    const basePozo: number[] = [];
    const coronaTuberia: number[] = [];
    const baseTuberia: number[] = [];
    const infoTramos: string[] = [];
    const nombresPozosInicioFin: string[] = [];

    this.perfiles.forEach((p) => {
      nombresPozos.push(p.nombrePozoInicio);
      const terrenoInicio = p.cotaTerrenoInicio;
      const baseInicio = terrenoInicio - p.alturaInicio;
      const corona = baseInicio + (p.diametro / 1000);

      cotaTerreno.push(terrenoInicio);
      basePozo.push(baseInicio);
      baseTuberia.push(baseInicio);
      coronaTuberia.push(corona);

      const nombreInicioFin = `${p.nombrePozoInicio} - ${p.nombrePozoFin}`;
      nombresPozosInicioFin.push(nombreInicioFin);

      infoTramos.push(
        `Pendiente: ${p.pendiente}%
        Caudal: ${p.caudal} l/s
        Velocidad: ${p.velocidad} m/s
        Diámetro: ${p.diametro} mm
        Material: ${p.material}
        Longitud: ${p.longitud} m`
      );
    });

    const ultimoPozo = this.perfiles[this.perfiles.length - 1];
    if (ultimoPozo) {
      nombresPozos.push(ultimoPozo.nombrePozoFin);

      const terrenoFin = ultimoPozo.cotaTerrenoFin;
      const baseFin = terrenoFin - ultimoPozo.alturaFin;
      const coronaFin = baseFin + (ultimoPozo.diametro / 1000);

      cotaTerreno.push(terrenoFin);
      basePozo.push(baseFin);
      baseTuberia.push(baseFin);
      coronaTuberia.push(coronaFin);

      nombresPozosInicioFin.push(ultimoPozo.nombrePozoFin);
    }

    const todasCotas = [...cotaTerreno, ...basePozo, ...coronaTuberia];
    const cotaMin = Math.floor(Math.min(...todasCotas) / 5) * 5;
    const cotaMax = Math.ceil(Math.max(...todasCotas) / 5) * 5;

    this.originalYMin = cotaMin;
    this.originalYMax = cotaMax;

    if (this.chart) {
      this.chart.destroy();
    }

    const data: ChartConfiguration<'line' | 'bar'>['data'] = {
      labels: nombresPozos,
      datasets: [
        {
          label: 'Cota terreno',
          data: cotaTerreno,
          borderColor: '#8B4513',
          fill: false,
          tension: 0.3,
          type: 'line',
          borderWidth: 1.5,
          pointBackgroundColor: '#8B4513',
          pointRadius: 1
        },
        {
          label: 'Corona tubería',
          data: coronaTuberia,
          borderColor: '#1E90FF',
          fill: false,
          tension: 0.3,
          type: 'line',
          borderWidth: 1.5,
          pointBackgroundColor: '#1E90FF',
          pointRadius: 1
        },
        {
          label: 'Base tubería',
          data: baseTuberia,
          borderColor: '#0000CD',
          fill: false,
          tension: 0.3,
          type: 'line',
          borderWidth: 1.5,
          pointBackgroundColor: '#0000CD',
          pointRadius: 1
        },
        {
          label: 'Pozo',
          data: basePozo.map((b, i) => ({ x: i, y: [b, cotaTerreno[i]] } as any)),
          backgroundColor: '#A9A9A9',
          yAxisID: 'y',
          borderWidth: 1,
          type: 'bar',
          barPercentage: 0.2,
          categoryPercentage: 0.9
        }
      ]
    };
    const zoomCallbacks = {
      onZoom: ({ chart }: { chart: Chart }) => {
        this.actualizarEstadoZoom();
      },
      onZoomComplete: ({ chart }: { chart: Chart }) => {
        this.actualizarEstadoZoom();
      }
    };
    const options: ChartOptions<'line' | 'bar'> = {
      responsive: true,
      interaction: {
        mode: 'nearest', intersect: false, includeInvisible: false
      },
      events: ['click'],
      plugins: {
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          position: 'nearest',
          callbacks: {
            title: (context) => {
              const indice = context[0].dataIndex;
              if (indice < nombresPozosInicioFin.length) {
                return `Tramo: ${nombresPozosInicioFin[indice]}`;
              }
              return `Pozo: ${context[0].label}`;
            },
            label: (context) => {
              if (context.datasetIndex === 2) {
                const indice = context.dataIndex;
                if (indice < infoTramos.length) {
                  const infoLines = infoTramos[indice].split('\n');
                  return infoLines;
                }
              }
              return [];
            }
          }
        },
        legend: {
          position: 'bottom',
          onClick: (e, legendItem, legend) => {
            return;
          }
        },
        title: {
          display: false,
          text: ''
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
              speed: 0.1,
            },
            pinch: {
              enabled: true,
            },
            mode: 'xy',
            scaleMode: 'xy',
            onZoom: zoomCallbacks.onZoom,
            onZoomComplete: zoomCallbacks.onZoomComplete
          },
          pan: {
            enabled: true,
            mode: 'xy',
            threshold: 10,
          },
          limits: {
            x: { min: 0, max: nombresPozos.length - 1, minRange: 2 },
            y: { min: cotaMin - 5, max: cotaMax + 5, minRange: 5 },
          }
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Cotas (m)'
          },
          min: cotaMin,
          max: cotaMax,
          grid: { color: '#cccccc55' },
          ticks: {
            stepSize: 1,
            callback: function (value) {
              const numValue = typeof value === 'string' ? parseFloat(value) : value;
              return `${Math.round(numValue)} m`
            },
            precision: 0,
          }
        },
        x: {
          title: {
            display: true,
            text: 'Pozos'
          }
        }
      }
    };

    this.chart = new Chart<'line' | 'bar'>('perfilCanvas', {
      type: 'line',
      data,
      options
    });

    const canvas = document.getElementById('perfilCanvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.addEventListener('wheel', () => {
        setTimeout(() => {
          this.actualizarEstadoZoom();
        }, 50);
      });
    }
  }

  private actualizarEstadoZoom(): void {
    if (this.chart) {
      const yScale = this.chart.scales['y'];
      if (yScale) {
        const tieneZoom = Math.abs(yScale.min - this.originalYMin) > 0.1 ||
          Math.abs(yScale.max - this.originalYMax) > 0.1;

        if (tieneZoom !== this.isZoomed) {
          this.isZoomed = tieneZoom;
          this.cdRef.detectChanges();
        }
      }
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}