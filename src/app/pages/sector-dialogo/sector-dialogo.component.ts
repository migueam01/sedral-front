import { Component, OnInit } from '@angular/core';
import { Sector } from '../../_model/sector';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SectorService } from '../../_service/sector.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Proyecto } from '../../_model/proyecto';
import { ProyectoService } from '../../_service/proyecto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sector-dialogo',
  standalone: false,
  templateUrl: './sector-dialogo.component.html',
  styleUrl: './sector-dialogo.component.css'
})
export class SectorDialogoComponent implements OnInit {

  form!: FormGroup;
  sector!: Sector;
  edicion!: boolean;
  idSector!: number;

  proyectos: Proyecto[] = [];

  constructor(private sectorService: SectorService, private proyectoService: ProyectoService,
    private builder: FormBuilder, private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.sector = new Sector();
    this.form = this.builder.group({
      'idSector': new FormControl(0),
      'nombre': new FormControl(''),
      'proyectoSelect': new FormControl('')
    });
    this.route.params.subscribe((params: Params) => {
      this.idSector = params['idSector'];
      this.edicion = this.idSector != null;
      this.initForm();
    })
  }

  initForm() {
    if (this.edicion) {
      forkJoin({
        proyectosSelect: this.proyectoService.listarTodos(),
        sectorSelect: this.sectorService.listarPorId(this.idSector)
      }).subscribe(({ proyectosSelect, sectorSelect }) => {
        this.proyectos = proyectosSelect;
        this.form.patchValue({
          'idSector': sectorSelect.idSector,
          'nombre': sectorSelect.nombre,
          'proyectoSelect': sectorSelect.proyecto.idProyecto
        });
      });
    } else {
      this.proyectoService.listarTodos().subscribe({
        next: data => {
          this.proyectos = data;
        }
      })
    }
  }

  aceptar() {
    let proyectoEnviar = new Proyecto();
    this.sector.nombre = this.form.value['nombre'];
    proyectoEnviar.idProyecto = this.form.value['proyectoSelect'];
    this.sector.sincronizado = false;
    this.sector.proyecto = proyectoEnviar;
    if (this.edicion) {
      this.sector.idSector = this.form.value['idSector'];
      this.sectorService.modificar(this.sector).subscribe(() => {
        Swal.fire({
          title: "INFO",
          text: "Registro actualizado",
          icon: "success"
        })
      });
    } else {
      this.sectorService.registrar(this.sector).subscribe(() => {
        Swal.fire({
          title: "INFO",
          text: "Registro agregado",
          icon: "success"
        })
      });
    }
    this.router.navigate(['/sector']);
  }
}