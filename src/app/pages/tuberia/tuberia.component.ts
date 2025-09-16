import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Tuberia } from '../../_model/tuberia';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TuberiaService } from '../../_service/tuberia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tuberia',
  standalone: false,
  templateUrl: './tuberia.component.html',
  styleUrl: './tuberia.component.css'
})
export class TuberiaComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<Tuberia>([]);
  public displayedColumns = ['idTuberia', 'pozoInicio', 'pozoFin', 'diametro', 'material', 'acciones'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: TuberiaService) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.service.tuberiaCambio.subscribe({
      next: data => {
        this.dataSource.data = data;
      }
    });

    this.service.mensajeCambio.subscribe({
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

    this.service.listarTodos().subscribe({
      next: data => {
        this.dataSource.data = data;
      },
      error: err => {
        console.log(err);
      }
    });

    this.dataSource.filterPredicate = (data: Tuberia, filter: string): boolean => {
      const dataStr = (
        data.diametro + data.material + (data.pozoInicio.nombre ?? '') + (data.pozoFin.nombre ?? '')
      ).toLowerCase();
      return dataStr.includes(filter.trim().toLowerCase());
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(idTuberia: number) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Está seguro que desea eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(idTuberia).subscribe(() => {
          this.service.listarTodos().subscribe(data => {
            this.service.tuberiaCambio.next(data);
          });
        });
        Swal.fire(
          'Eliminado',
          'El registro se eliminó',
          'success'
        );
      }
    });
  }
}