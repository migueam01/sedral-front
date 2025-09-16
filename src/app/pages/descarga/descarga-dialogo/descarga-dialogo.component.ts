import { Component, OnInit } from '@angular/core';
import { Descarga } from '../../../_model/descarga';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DescargaService } from '../../../_service/descarga.service';

@Component({
  selector: 'app-descarga-dialogo',
  standalone: false,
  templateUrl: './descarga-dialogo.component.html',
  styleUrl: './descarga-dialogo.component.css'
})
export class DescargaDialogoComponent implements OnInit {
  descarga!: Descarga;
  form!: FormGroup;
  edicion!: boolean;
  idDescarga!: number;

  constructor(private service: DescargaService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.descarga = new Descarga();

    this.form = new FormGroup({
      'idDescarga': new FormControl(0),
      'nombre': new FormControl(''),
      'ubicacion': new FormControl('')
    })

    this.route.params.subscribe((params: Params) => {
      this.idDescarga = params['idDescarga'];
      this.edicion = this.idDescarga != null;
      this.initForm();
    })
  }

  initForm() {
    if (this.edicion) {
      this.service.listarPorId(this.idDescarga).subscribe({
        next: data => {
          this.form.patchValue({
            'idDescarga': data.idDescarga,
            'nombre': data.nombre,
            'ubicacion': data.ubicacion
          });
        }, error: err => {
          console.log(err.error.mensaje);
        }
      })
    }
  }

  operar() {
    this.descarga.nombre = this.form.value['nombre'];
    this.descarga.ubicacion = this.form.value['ubicacion'];
    this.descarga.sincronizado = false;
    if (this.edicion) {
      this.descarga.idDescarga = this.form.value['idDescarga'];
      this.service.modificar(this.descarga).subscribe(() => {
        this.service.listarTodos().subscribe(data => {
          this.service.descargaCambio.next(data);
          this.service.mensajeCambio.next('Registro actualizado');
        });
      });
    } else {
      this.service.registrar(this.descarga).subscribe(() => {
        this.service.listarTodos().subscribe(data => {
          this.service.descargaCambio.next(data);
          this.service.mensajeCambio.next('Registro agregado');
        });
      });
    }
    this.router.navigate(['/descarga']);
  }
}
