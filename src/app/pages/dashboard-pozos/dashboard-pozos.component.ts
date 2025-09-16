import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PozoService } from '../../_service/pozo.service';
import { StatsAlturaPozo } from '../../_model/stats-altura-pozos';
import { Observable } from 'rxjs';
import { Chart, ChartData, ChartOptions, registerables, TooltipItem } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CantidadPozo } from '../../_model/cantidad-pozo';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-pozos',
  standalone: false,
  templateUrl: './dashboard-pozos.component.html',
  styleUrl: './dashboard-pozos.component.css'
})
export class DashboardPozosComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('estadosChart', { static: true })
  estadosChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tapadosChart', { static: true })
  tapadosChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('calzadasChart', { static: true })
  calzadasChart!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  totalPozos: Observable<number> | undefined;
  statsAltura!: Observable<StatsAlturaPozo[]>;
  estados: CantidadPozo[] = [];
  tapados: CantidadPozo[] = [];
  calzadas: CantidadPozo[] = [];

  constructor(private service: PozoService) { }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }

  ngAfterViewInit(): void {
    this.cargarDatosEstados();
    this.cargarDatosTapados();
    this.cargarDatosCalzadas();
  }

  ngOnInit(): void {
    this.totalPozos = this.service.obtenerTotalPozos();

    this.statsAltura = this.service.listarStatsAltura();
  }

  cargarDatosEstados() {
    this.service.listarPorEstado().subscribe({
      next: data => {
        this.estados = data;
        this.renderizarGraficoEstados();
      }
    });
  }

  cargarDatosTapados() {
    this.service.listarPorTapados().subscribe({
      next: data => {
        this.tapados = data;
        this.renderizarGraficoTapados();
      }
    });
  }

  cargarDatosCalzadas() {
    this.service.listarPorCalzada().subscribe({
      next: data => {
        this.calzadas = data;
        this.renderizarGraficoCalzadas();
      }
    });
  }

  private renderizarGraficoEstados(): void {
    const ctx = this.estadosChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.estados.map(d => d.valor);
    const valores = this.estados.map(d => d.cantidad ?? 0);
    const colores = this.generaColores(this.estados.length);

    const data: ChartData<'bar'> = {
      labels,
      datasets: [{ label: 'Cantidad de pozos', data: valores, backgroundColor: colores }]
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (item: TooltipItem<'bar'>) => {
              const idx = item.dataIndex;
              const cantidad = this.estados[idx].cantidad ?? 0;
              const porcentaje = this.estados[idx].porcentaje ?? 0;
              return ` ${cantidad} (${porcentaje.toFixed(2)}%)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de pozos',
            padding: { top: 10, bottom: 20 }
          },
          ticks: {
            callback: (value) => `${Number(value)}`
          }
        },
        x: {
          title: {
            display: true,
            text: 'Estado del pozo',
            padding: { top: 20 }
          }
        }
      }
    };
    this.charts.push(new Chart(ctx, { type: 'bar', data, options }));
  }

  private renderizarGraficoTapados(): void {
    const ctx = this.tapadosChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.tapados.map(d => d.valor);
    const porcentajes = this.tapados.map(d => d.porcentaje ?? 0);
    const colores = this.generaColores(this.tapados.length);

    const data: ChartData<'pie'> = {
      labels,
      datasets: [
        { data: porcentajes, backgroundColor: colores }
      ]
    };

    const options: ChartOptions<'pie'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (item: TooltipItem<'pie'>) => {
              const idx = item.dataIndex;
              const cantidad = this.tapados[idx].cantidad ?? 0;
              const porcentaje = this.tapados[idx].porcentaje ?? 0;
              return ` ${cantidad} (${porcentaje.toFixed(2)}%)`;
            }
          }
        },
        datalabels: {
          display: true,
          color: '#1a1717ff',
          font: { weight: 'bold' },
          formatter: (value: number) => `${value.toFixed(2)}%`
        }
      }
    };
    this.charts.push(
      new Chart(ctx, {
        type: 'pie',
        data,
        options,
        plugins: [ChartDataLabels]
      }));
  }

  private renderizarGraficoCalzadas(): void {
    const ctx = this.calzadasChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.calzadas.map(d => d.valor);
    const valores = this.calzadas.map(d => d.cantidad ?? 0);
    const colores = this.generaColores(this.calzadas.length);

    const data: ChartData<'bar'> = {
      labels,
      datasets: [{ label: 'Cantidad de pozos', data: valores, backgroundColor: colores }]
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y', //Invierte los ejes para barras horizontales
      plugins: {
        tooltip: {
          callbacks: {
            label: (item: TooltipItem<'bar'>) => {
              const idx = item.dataIndex;
              const cantidad = this.calzadas[idx].cantidad ?? 0;
              const porcentaje = this.calzadas[idx].porcentaje ?? 0;
              return ` ${cantidad} (${porcentaje.toFixed(2)}%)`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de pozos',
            padding: { top: 10, bottom: 20 }
          },
          ticks: {
            callback: (value) => `${Number(value)}`
          }
        },
        y: {
          title: {
            display: true,
            text: 'Tipo de calzada',
            padding: 20
          }
        }
      }
    };

    this.charts.push(new Chart(ctx, { type: 'bar', data, options }));
  }

  private generaColores(cantidad: number): string[] {
    const base = [
      'rgba(255, 99, 133, 0.45)',
      'rgba(54, 162, 235, 0.45)',
      'rgba(255, 206, 86, 0.45)',
      'rgba(75, 192, 192, 0.45)',
      'rgba(153, 102, 0, 0.45)',
      'rgba(255, 159, 64, 0.45)'
    ];
    return Array.from({ length: cantidad }, (_, i) => base[i % base.length]);
  }
}
