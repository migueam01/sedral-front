import { Component, OnInit } from '@angular/core';
import { Responsable } from '../../../_model/responsable';
import { FormControl, FormGroup } from '@angular/forms';
import { ResponsableService } from '../../../_service/responsable.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-responsable-dialogo',
  standalone: false,
  templateUrl: './responsable-dialogo.component.html',
  styleUrl: './responsable-dialogo.component.css'
})
export class ResponsableDialogoComponent implements OnInit {

  responsable!: Responsable;
  form!: FormGroup;
  edicion!: boolean;
  idResponsable!: number;

  constructor(private responsableService: ResponsableService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.responsable = new Responsable();

    this.form = new FormGroup({
      'idResponsable': new FormControl(0),
      'nombre': new FormControl(''),
      'apellido': new FormControl(''),
      'telefono': new FormControl('')
    })

    this.route.params.subscribe((params: Params) => {
      this.idResponsable = params['idResponsable'];
      this.edicion = this.idResponsable != null;
      this.initForm();
    })
  }

  initForm() {
    if (this.edicion) {
      this.responsableService.listarPorId(this.idResponsable).subscribe({
        next: data => {
          this.form.patchValue({
            'idResponsable': data.idResponsable,
            'nombre': data.nombre,
            'apellido': data.apellido,
            'telefono': data.telefono
          });
        }, error: err => {
          console.log(err.error.mensaje);
        }
      })
    }
  }

  operar() {
    this.responsable.nombre = this.form.value['nombre'];
    this.responsable.apellido = this.form.value['apellido'];
    this.responsable.telefono = this.form.value['telefono'];
    this.responsable.sincronizado = false;
    if (this.edicion) {
      this.responsable.idResponsable = this.form.value['idResponsable'];
      this.responsableService.modificar(this.responsable).subscribe(() => {
        this.responsableService.listarTodos().subscribe(data => {
          this.responsableService.responsableCambio.next(data);
          this.responsableService.mensajeCambio.next('Registro actualizado');
        });
      });
    } else {
      this.responsableService.registrar(this.responsable).subscribe(() => {
        this.responsableService.listarTodos().subscribe(data => {
          this.responsableService.responsableCambio.next(data);
          this.responsableService.mensajeCambio.next('Registro agregado');
        });
      });
    }
    this.router.navigate(['/responsable']);
  }
}