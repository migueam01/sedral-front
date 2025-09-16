import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Proyecto } from '../../_model/proyecto';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProyectoService } from '../../_service/proyecto.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-proyecto',
  standalone: false,
  templateUrl: './proyecto.component.html',
  styleUrl: './proyecto.component.css'
})
export class ProyectoComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<Proyecto>([]);
  public displayedColumns = ['idProyecto', 'nombre', 'nombreGadm', 'acciones'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private proyectoService: ProyectoService, public route: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.proyectoService.proyectoCambio.subscribe({
      next: data => {
        this.dataSource.data = data;
      }
    });

    this.proyectoService.mensajeCambio.subscribe({
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

    this.proyectoService.listarTodos().subscribe({
      next: data => {
        this.dataSource.data = data;
      },
      error: err => {
        Swal.fire({
          title: "ERROR",
          text: "Ha ocurrido un error",
          icon: "error"
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(idProyecto: number) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Está seguro que desea eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proyectoService.eliminar(idProyecto).subscribe(() => {
          this.proyectoService.listarTodos().subscribe(data => {
            this.proyectoService.proyectoCambio.next(data);
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