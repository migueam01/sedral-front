import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaTuberia } from '../../_model/consulta-tuberia';
import { RangoLongitud } from '../../_model/rango-longitud';
import { TuberiaService } from '../../_service/tuberia.service';
import { Chart, ChartData, ChartOptions, registerables, TooltipItem } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Observable } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-tuberias',
  standalone: false,
  templateUrl: './dashboard-tuberias.component.html',
  styleUrl: './dashboard-tuberias.component.css'
})
export class DashboardTuberiasComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('diametrosChart', { static: true })
  diametrosChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('materialesChart', { static: true })
  materialesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('funcionamientoChart', { static: true })
  funcionamientoChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rangosChart', { static: true })
  rangosChart!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  totalTuberias: Observable<number> | undefined;
  sumaLongitudes: Observable<number> | undefined;
  funcionamientos: ConsultaTuberia[] = [];
  diametros: ConsultaTuberia[] = [];
  materiales: ConsultaTuberia[] = [];
  rangosLongitud: RangoLongitud[] = [];

  constructor(private service: TuberiaService) {
  }

  ngOnInit(): void {
    this.totalTuberias = this.service.obtenerTotalTuberias();
    this.sumaLongitudes = this.service.obtenerSumaLongitudes();
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }

  ngAfterViewInit(): void {
    this.cargarDatosDiametros();
    this.cargarDatosMateriales();
    this.cargarDatosFuncionamiento();
    this.cargarDatosRangos();
  }

  cargarDatosDiametros() {
    this.service.listarPorDiametro().subscribe({
      next: data => {
        this.diametros = data;
        this.renderizarGraficoDiametros();
      }
    });
  }

  cargarDatosMateriales() {
    this.service.listarPorMaterial().subscribe({
      next: data => {
        this.materiales = data;
        this.renderizarGraficoMateriales();
      }
    });
  }

  cargarDatosFuncionamiento() {
    this.service.listarPorFuncionamiento().subscribe({
      next: data => {
        this.funcionamientos = data;
        this.renderizarGraficoFuncionamiento();
      }
    });
  }

  cargarDatosRangos() {
    this.service.listarPorRangoLongituid().subscribe({
      next: data => {
        this.rangosLongitud = data;
        this.renderizarGraficoRangos();
      }
    });
  }

  private renderizarGraficoDiametros(): void {
    const ctx = this.diametrosChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.diametros.map(d => d.valor);
    const valores = this.diametros.map(d => d.longitudTotal ?? 0);
    const colores = this.generaColores(this.diametros.length);

    const data: ChartData<'bar'> = {
      labels,
      datasets: [{ label: 'Longitud', data: valores, backgroundColor: colores }]
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (item: TooltipItem<'bar'>) => {
              const idx = item.dataIndex;
              const longitud = this.diametros[idx].longitudTotal ?? 0;
              const porcentaje = this.diametros[idx].porcentajeLongitud ?? 0;
              return ` ${longitud.toFixed(2)} (${porcentaje.toFixed(2)}%)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Longitud (m)',
            padding: { top: 10, bottom: 20 }
          },
          ticks: {
            callback: (value) => `${Number(value)}`
          }
        },
        x: {
          title: {
            display: true,
            text: 'Diámetro (mm)',
            padding: { top: 20 }
          }
        }
      }
    };
    this.charts.push(new Chart(ctx, { type: 'bar', data, options }));
  }

  private renderizarGraficoMateriales(): void {
    const ctx = this.materialesChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.materiales.map(d => d.valor);
    const porcentajes = this.materiales.map(d => d.porcentajeLongitud ?? 0);
    const colores = this.generaColores(this.materiales.length);

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
              const longitud = this.materiales[idx].longitudTotal ?? 0;
              const porcentaje = this.materiales[idx].porcentajeLongitud ?? 0;
              return ` ${longitud.toFixed(2)} (${porcentaje.toFixed(2)}%)`;
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

  private renderizarGraficoFuncionamiento(): void {
    const ctx = this.funcionamientoChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.funcionamientos.map(d => d.valor);
    const valores = this.funcionamientos.map(d => d.longitudTotal ?? 0); //si requiere mostrar longitudes en las porciones
    const porcentajes = this.funcionamientos.map(d => d.porcentajeLongitud ?? 0);
    const colores = this.generaColores(this.funcionamientos.length);

    const data: ChartData<'doughnut'> = {
      labels,
      datasets: [{ data: porcentajes, backgroundColor: colores }]
    };

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (item: TooltipItem<'doughnut'>) => {
              const idx = item.dataIndex;
              const longitud = this.funcionamientos[idx].longitudTotal ?? 0;
              const porcentaje = this.funcionamientos[idx].porcentajeLongitud ?? 0;
              return ` ${longitud.toFixed(2)} (${porcentaje.toFixed(2)}%)`;
            }
          }
        },
        datalabels: {
          display: true,
          color: '#000000ff',
          font: { weight: 'bold' },
          formatter: (value: number) => `${value.toFixed(2)} m`
        }
      }
    };

    this.charts.push(
      new Chart(ctx, {
        type: 'doughnut',
        data,
        options,
        plugins: [ChartDataLabels]
      }));
  }

  private renderizarGraficoRangos(): void {
    const ctx = this.rangosChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.rangosLongitud.map(d => d.rangoLongitud);
    const valores = this.rangosLongitud.map(d => d.longitudTotal ?? 0);
    const colores = this.generaColores(this.rangosLongitud.length);

    const data: ChartData<'bar'> = {
      labels,
      datasets: [{ label: 'Longitud', data: valores, backgroundColor: colores }]
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (item: TooltipItem<'bar'>) => {
              const idx = item.dataIndex;
              const longitud = this.rangosLongitud[idx].longitudTotal ?? 0;
              return `${longitud.toFixed(2)}m`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Longitud (m)',
            padding: { top: 10, bottom: 20 }
          },
          ticks: {
            callback: (value) => `${Number(value)}`
          }
        },
        x: {
          title: {
            display: true,
            text: 'Rango longitud (m)',
            padding: { top: 20 }
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
