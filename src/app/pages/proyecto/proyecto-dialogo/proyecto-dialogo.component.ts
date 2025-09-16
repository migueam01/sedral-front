import { Component, OnInit } from '@angular/core';
import { Proyecto } from '../../../_model/proyecto';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProyectoService } from '../../../_service/proyecto.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Gadm } from '../../../_model/gadm';
import { GadmService } from '../../../_service/gadm.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proyecto-dialogo',
  standalone: false,
  templateUrl: './proyecto-dialogo.component.html',
  styleUrl: './proyecto-dialogo.component.css'
})
export class ProyectoDialogoComponent implements OnInit {

  proyecto!: Proyecto;
  form!: FormGroup;
  edicion!: boolean;
  idProyecto!: number;

  gadms: Gadm[] = [];

  constructor(private gadmService: GadmService, private proyectoService: ProyectoService, private router: Router,
    private route: ActivatedRoute, private builder: FormBuilder) { }

  ngOnInit(): void {
    this.proyecto = new Proyecto();
    this.form = new FormGroup({
      'idProyecto': new FormControl(0),
      'nombre': new FormControl(''),
      'alias': new FormControl(''),
      'gadmSelect': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.idProyecto = params['idProyecto'];
      this.edicion = this.idProyecto != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      forkJoin({
        gadmsSelect: this.gadmService.listarTodos(),
        proyectoSelect: this.proyectoService.listarPorId(this.idProyecto)
      }).subscribe(({ gadmsSelect, proyectoSelect }) => {
        this.gadms = gadmsSelect;
        this.form.patchValue({
          'idProyecto': proyectoSelect.idProyecto,
          'nombre': proyectoSelect.nombre,
          'alias': proyectoSelect.alias,
          'gadmSelect': proyectoSelect.gadm.idGadm
        });
      });
    } else {
      this.gadmService.listarTodos().subscribe({
        next: data => {
          this.gadms = data;
        }
      });
    }
  }

  operar() {
    let gadmEnviar = new Gadm();
    this.proyecto.nombre = this.form.value['nombre'];
    this.proyecto.alias = this.form.value['alias'];
    gadmEnviar.idGadm = this.form.value['gadmSelect'];
    this.proyecto.sincronizado = false;
    this.proyecto.gadm = gadmEnviar;
    if (this.edicion) {
      this.proyecto.idProyecto = this.form.value['idProyecto'];
      this.proyectoService.modificar(this.proyecto).subscribe(() => {
        Swal.fire({
          title: "INFO",
          text: "Registro actualizado",
          icon: "success"
        })
      });
    } else {
      this.proyectoService.registrar(this.proyecto).subscribe(() => {
        Swal.fire({
          title: "INFO",
          text: "Registro agregado",
          icon: "success"
        })
      });
    }
    this.router.navigate(['/proyecto']);
  }
}