import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GadmService } from '../../../_service/gadm.service';
import { Gadm } from '../../../_model/gadm';

@Component({
  selector: 'app-gadm-dialogo',
  standalone: false,
  templateUrl: './gadm-dialogo.component.html',
  styleUrl: './gadm-dialogo.component.css'
})
export class GadmDialogoComponent implements OnInit {

  gadm!: Gadm;
  form!: FormGroup;
  edicion!: boolean;
  idGadm!: number;

  constructor(private gadmService: GadmService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.gadm = new Gadm();

    this.form = new FormGroup({
      'idGadm': new FormControl(0),
      'nombre': new FormControl(''),
      'alias': new FormControl('')
    })

    this.route.params.subscribe((params: Params) => {
      this.idGadm = params['idGadm'];
      this.edicion = this.idGadm != null;
      this.initForm();
    })
  }

  initForm() {
    if (this.edicion) {
      this.gadmService.listarPorId(this.idGadm).subscribe({
        next: data => {
          this.form.patchValue({
            'idGadm': data.idGadm,
            'nombre': data.nombre,
            'alias': data.alias
          });
        }, error: err => {
          console.log(err.error.mensaje);
        }
      })
    }
  }

  operar() {
    this.gadm.nombre = this.form.value['nombre'];
    this.gadm.alias = this.form.value['alias'];
    if (this.edicion) {
      this.gadm.idGadm = this.form.value['idGadm'];
      this.gadmService.modificar(this.gadm).subscribe(() => {
        this.gadmService.listarTodos().subscribe(data => {
          this.gadmService.gadmCambio.next(data);
          this.gadmService.mensajeCambio.next('Registro actualizado');
        });
      });
    } else {
      this.gadmService.registrar(this.gadm).subscribe(() => {
        this.gadmService.listarTodos().subscribe(data => {
          this.gadmService.gadmCambio.next(data);
          this.gadmService.mensajeCambio.next('Registro agregado');
        });
      });
    }
    this.router.navigate(['/gadm']);
  }
}