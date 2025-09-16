import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Responsable } from '../../_model/responsable';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ResponsableService } from '../../_service/responsable.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-responsable',
  standalone: false,
  templateUrl: './responsable.component.html',
  styleUrl: './responsable.component.css'
})
export class ResponsableComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<Responsable>([]);
  public displayedColumns = ['idResponsable', 'nombre', 'apellido', 'acciones'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private responsableService: ResponsableService, public route: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.responsableService.responsableCambio.subscribe({
      next: data => {
        this.dataSource.data = data;
      }
    });

    this.responsableService.mensajeCambio.subscribe({
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

    this.responsableService.listarTodos().subscribe({
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

  eliminar(idResponsable: number) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Está seguro que desea eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.responsableService.eliminar(idResponsable).subscribe(() => {
          this.responsableService.listarTodos().subscribe(data => {
            this.responsableService.responsableCambio.next(data);
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