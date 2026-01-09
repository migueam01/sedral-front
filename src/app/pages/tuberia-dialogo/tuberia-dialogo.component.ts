import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Pozo } from '../../_model/pozo';
import { TuberiaService } from '../../_service/tuberia.service';
import { PozoService } from '../../_service/pozo.service';
import { Tuberia } from '../../_model/tuberia';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tuberia-dialogo',
  standalone: false,
  templateUrl: './tuberia-dialogo.component.html',
  styleUrl: './tuberia-dialogo.component.css'
})
export class TuberiaDialogoComponent implements OnInit {

  form!: FormGroup;
  pozos: Pozo[] = [];
  tuberia!: Tuberia;
  edicion!: boolean;
  idTuberia!: number;

  myControlInicio = new FormControl('');
  myControlFin = new FormControl('');
  filteredOptionsInicio!: Observable<Pozo[]>;
  filteredOptionsFin!: Observable<Pozo[]>;

  orientaciones: string[] = ['Norte', 'Sur', 'Este', 'Oeste'];
  flujos: string[] = ['Entra', 'Sale', 'Inicio', 'ND'];
  materiales: string[] = ['PVC', 'HS', 'HA', 'Otros'];
  funciona: string[] = ['Si', 'No'];

  constructor(private tuberiaService: TuberiaService, private pozoService: PozoService,
    private builder: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.tuberia = new Tuberia();
    this.form = this.builder.group({
      'idTuberia': new FormControl(0),
      'pozoInicio': this.myControlInicio,
      'pozoFin': this.myControlFin,
      'orientacion': new FormControl(''),
      'flujo': new FormControl(''),
      'hBase': new FormControl(0),
      'hCorona': new FormControl(0),
      'diametro': new FormControl(0),
      'material': new FormControl(''),
      'calado': new FormControl(0),
      'areaAporte': new FormControl(0),
      'funciona': new FormControl('')
    });
    this.route.params.subscribe((params: Params) => {
      this.idTuberia = params['idTuberia'];
      this.edicion = this.idTuberia != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      forkJoin({
        listaPozos: this.pozoService.listarTodos(),
        tuberiaBusqueda: this.tuberiaService.listarPorId(this.idTuberia)
      }).subscribe(({ listaPozos, tuberiaBusqueda }) => {
        this.pozos = listaPozos;
        this.form.patchValue({
          'idTuberia': tuberiaBusqueda.idTuberia,
          'pozoInicio': tuberiaBusqueda.pozoInicio,
          'pozoFin': tuberiaBusqueda.pozoFin,
          'orientacion': tuberiaBusqueda.orientacion,
          'flujo': tuberiaBusqueda.flujo,
          'hBase': tuberiaBusqueda.base,
          'hCorona': tuberiaBusqueda.corona,
          'diametro': tuberiaBusqueda.diametro,
          'material': tuberiaBusqueda.material,
          'calado': tuberiaBusqueda.calado,
          'areaAporte': tuberiaBusqueda.areaAporte,
          'funciona': tuberiaBusqueda.funciona
        });
        this.filteredOptionsInicio = this.myControlInicio.valueChanges.pipe(
          startWith(''),
          map((val) => this.filterInicio(val || '')));

        this.filteredOptionsFin = this.myControlFin.valueChanges.pipe(
          startWith(''),
          map((val) => this.filterFin(val || '')));
      });
    } else {
      this.pozoService.listarTodos().subscribe({
        next: data => {
          this.pozos = data;
          this.filteredOptionsInicio = this.myControlInicio.valueChanges.pipe(
            startWith(''),
            map((val) => this.filterInicio(val || '')));

          this.filteredOptionsFin = this.myControlFin.valueChanges.pipe(
            startWith(''),
            map((val) => this.filterFin(val || '')));
        }
      })
    }
  }

  //para autocomplete
  filterInicio(val: any): Pozo[] {
    let valorLower;
    if (val != null && val.idPozo > 0) {
      valorLower = val.nombre.toLowerCase();
    } else {
      valorLower = val.toLowerCase();
    }
    return this.pozos.filter((c) =>
      c.nombre.toLowerCase().includes(valorLower)
    );
  }

  filterFin(val: any): Pozo[] {
    let valorLower;
    if (val != null && val.idPozo > 0) {
      valorLower = val.nombre.toLowerCase();
    } else {
      valorLower = val.toLowerCase();
    }
    return this.pozos.filter((c) =>
      c.nombre.toLowerCase().includes(valorLower)
    );
  }

  displayFn(val: Pozo) {
    return val ? `${val.nombre}` : val;
  }
  //fin para autocomplete

  calcularDiametro() {
    const base = this.form.get('hBase')?.value;
    const corona = this.form.get('hCorona')?.value;
    const diametro = Math.round((base - corona) * 1000);
    this.form.get('diametro')?.setValue(diametro);
  }

  aceptar() {
    this.tuberia.pozoInicio = this.form.value['pozoInicio'];
    this.tuberia.pozoFin = this.form.value['pozoFin'];
    this.tuberia.orientacion = this.form.value['orientacion'];
    this.tuberia.flujo = this.form.value['flujo'];
    this.tuberia.base = this.form.value['hBase'];
    this.tuberia.corona = this.form.value['hCorona'];
    this.tuberia.diametro = this.form.value['diametro'];
    this.tuberia.material = this.form.value['material'];
    this.tuberia.calado = this.form.value['calado'];
    this.tuberia.calado = this.form.value['areaAporte'];
    this.tuberia.funciona = this.form.value['funciona'];
    if (this.edicion) {
      this.tuberia.idTuberia = this.form.value['idTuberia'];
      this.tuberiaService.modificar(this.tuberia).subscribe(() => {
        Swal.fire({
          title: "INFO",
          text: "Registro actualizado",
          icon: "success"
        });
      });
    } else {
      this.tuberiaService.registrar(this.tuberia).subscribe(() => {
        Swal.fire({
          title: "INFO",
          text: "Registro agregado",
          icon: "success"
        })
      });
    }
    this.router.navigate(['/tuberia']);
  }
}