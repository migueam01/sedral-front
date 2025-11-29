import { Component, OnInit } from '@angular/core';
import { Rol } from '../../../_model/rol';
import { FormControl, FormGroup } from '@angular/forms';
import { RolService } from '../../../_service/rol.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-rol-dialogo',
  standalone: false,
  templateUrl: './rol-dialogo.component.html',
  styleUrl: './rol-dialogo.component.css'
})
export class RolDialogoComponent implements OnInit {

  rol!: Rol;
  form!: FormGroup;
  edicion!: boolean;
  idRol!: number;

  constructor(private rolService: RolService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.rol = new Rol();

    this.form = new FormGroup({
      'idRol': new FormControl(0),
      'nombre': new FormControl(''),
      'descripcion': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.idRol = params['idRol'];
      this.edicion = this.idRol != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.rolService.listarPorId(this.idRol).subscribe({
        next: data => {
          this.form.patchValue({
            'idRol': data.idRol,
            'nombre': data.nombre,
            'descripcion': data.descripcion
          });
        }, error: err => {
          console.log(err.error.mensaje);
        }
      })
    }
  }

  operar() {
    this.rol.nombre = this.form.value['nombre'];
    this.rol.descripcion = this.form.value['descripcion'];
    if (this.edicion) {
      this.rol.idRol = this.form.value['idRol'];
      this.rolService.modificar(this.rol).subscribe(() => {
        this.rolService.listarTodos().subscribe(data => {
          this.rolService.rolCambio.next(data);
          this.rolService.mensajeCambio.next('Registro actualizado');
        });
      });
    } else {
      this.rolService.registrar(this.rol).subscribe(() => {
        this.rolService.listarTodos().subscribe(data => {
          this.rolService.rolCambio.next(data);
          this.rolService.mensajeCambio.next('Registro agregado');
        });
      });
    }
    this.router.navigate(['/rol']);
  }
}