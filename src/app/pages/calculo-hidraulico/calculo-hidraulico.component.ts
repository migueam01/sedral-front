import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CalculoHidraulico } from '../../_model/calculo-hidraulico';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CalculoService } from '../../_service/calculo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calculo-hidraulico',
  standalone: false,
  templateUrl: './calculo-hidraulico.component.html',
  styleUrl: './calculo-hidraulico.component.css'
})
export class CalculoHidraulicoComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<CalculoHidraulico>([]);
  public displayedColumns = ['idTuberia', 'nombrePozoInicio', 'nombrePozoFin', 'diametro', 'material', 'calado', 'manning',
    'pendiente', 'velocidad', 'caudal', 'relacionCaudal', 'relacionVelocidad', 'relacionArea'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private calculoService: CalculoService) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.calculoService.calculoCambio.subscribe({
      next: data => {
        this.dataSource.data = data;
      }
    });

    this.calculoService.mensajeCambio.subscribe({
      next: data => {
        Swal.fire({
          title: "INFO",
          text: data,
          icon: "success"
        });
      },
      error: err => {
        Swal.fire({
          title: "ERROR",
          text: "Ha ocurrido un error",
          icon: "error"
        });
      }
    });

    this.calculoService.obtenerCalculos().subscribe({
      next: data => {
        this.dataSource.data = data;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  realizarCalculos() {
    this.calculoService.realizarCalculos(4).subscribe(() => {
      this.calculoService.obtenerCalculos().subscribe(data => {
        this.calculoService.calculoCambio.next(data);
        this.calculoService.mensajeCambio.next("Cálculos hidráulicos generados correctamente");
      });
    });
  }
}