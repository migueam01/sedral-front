import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GadmService } from '../../_service/gadm.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Gadm } from '../../_model/gadm';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gadm',
  standalone: false,
  templateUrl: './gadm.component.html',
  styleUrl: './gadm.component.css'
})
export class GadmComponent implements OnInit, AfterViewInit {
  public dataSource = new MatTableDataSource<Gadm>([]);
  public displayedColumns = ['idGadm', 'nombre', 'acciones'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private gadmService: GadmService, public route: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.gadmService.gadmCambio.subscribe({
      next: data => {
        this.dataSource.data = data;
      }
    });

    this.gadmService.mensajeCambio.subscribe({
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

    this.gadmService.listarTodos().subscribe({
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

  eliminar(idGadm: number) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Está seguro que desea eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gadmService.eliminar(idGadm).subscribe(() => {
          this.gadmService.listarTodos().subscribe(data => {
            this.gadmService.gadmCambio.next(data);
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
