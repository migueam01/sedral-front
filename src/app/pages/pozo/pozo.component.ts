import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PozoService } from '../../_service/pozo.service';
import Swal from 'sweetalert2';
import { Pozo } from '../../_model/pozo';

@Component({
  selector: 'app-pozo',
  standalone: false,
  templateUrl: './pozo.component.html',
  styleUrl: './pozo.component.css'
})
export class PozoComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<Pozo>([]);
  public displayedColumns = ['nombre', 'tapado', 'estado', 'calzada', 'altura', 'acciones'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: PozoService) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.service.pozoCambio.subscribe({
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(idPozo: number) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Está seguro que desea eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(idPozo).subscribe(() => {
          this.service.listarTodos().subscribe(data => {
            this.service.pozoCambio.next(data);
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