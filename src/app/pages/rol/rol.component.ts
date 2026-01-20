import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Rol } from '../../_model/rol';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RolService } from '../../_service/rol.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rol',
  standalone: false,
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css'
})
export class RolComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<Rol>([]);
  public displayedColumns = ['idRol', 'nombre', 'descripcion', 'prioridad','acciones'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rolService: RolService, public route: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.rolService.rolCambio.subscribe({
      next: data => {
        this.dataSource.data = data;
      }
    });

    this.rolService.mensajeCambio.subscribe({
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

    this.rolService.listarTodos().subscribe({
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

  eliminar(idRol: number) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Está seguro que desea eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolService.eliminar(idRol).subscribe(() => {
          this.rolService.listarTodos().subscribe(data => {
            this.rolService.rolCambio.next(data);
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