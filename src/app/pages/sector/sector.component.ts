import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Sector } from '../../_model/sector';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SectorService } from '../../_service/sector.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sector',
  standalone: false,
  templateUrl: './sector.component.html',
  styleUrl: './sector.component.css'
})
export class SectorComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<Sector>([]);
  public displayedColumns = ['idSector', 'nombre', 'proyecto', 'acciones'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private sectorService: SectorService) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.sectorService.sectorCambio.subscribe({
      next: data => {
        this.dataSource.data = data;
      }
    });

    this.sectorService.mensajeCambio.subscribe({
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

    this.sectorService.listarTodos().subscribe({
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

  eliminar(idSector: number) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Está seguro que desea eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sectorService.eliminar(idSector).subscribe(() => {
          this.sectorService.listarTodos().subscribe(data => {
            this.sectorService.sectorCambio.next(data);
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