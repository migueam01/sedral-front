import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Pozo } from '../../_model/pozo';
import { Sector } from '../../_model/sector';
import { SectorService } from '../../_service/sector.service';
import { PozoService } from '../../_service/pozo.service';
import { Responsable } from '../../_model/responsable';
import { Descarga } from '../../_model/descarga';
import { ResponsableService } from '../../_service/responsable.service';
import { DescargaService } from '../../_service/descarga.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pozo-dialogo',
  standalone: false,
  templateUrl: './pozo-dialogo.component.html',
  styleUrl: './pozo-dialogo.component.css'
})
export class PozoDialogoComponent implements OnInit {

  primeraPantallaForm!: FormGroup;
  segundaPantallaForm!: FormGroup;
  terceraPantallaForm!: FormGroup;
  pozo!: Pozo;
  edicion!: boolean;
  idPozo!: number;

  fechaSelectCatastro: Date = new Date();
  fechaSelectActualiza: Date = new Date();
  maxFecha: Date = new Date();

  sectores: Sector[] = [];
  responsables: Responsable[] = [];
  descargas: Descarga[] = [];

  sistemas: string[] = ['SAN', 'PLV', 'COM', 'ND'];
  estados: string[] = ['Bueno', 'Regular', 'Malo'];
  calzadas: string[] = ['Adoquinado', 'Asfaltado', 'Latre-Ripio', 'Tierra', 'Empedrado', 'Potrero-Terreno'];
  opcionTapado: string[] = ['Si', 'No'];

  constructor(private pozoService: PozoService, private sectorService: SectorService,
    private responsableService: ResponsableService, private descargaService: DescargaService,
    private builder: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.pozo = new Pozo();

    this.primeraPantallaForm = this.builder.group({
      'idPozo': new FormControl(0),
      'nombre': new FormControl(''),
      'tapado': new FormControl(''),
      'sistema': new FormControl(''),
      'sectorSelect': new FormControl(''),
      'responsableSelect': new FormControl(''),
      'descargaSelect': new FormControl(''),
      'fechaCatastro': new FormControl(''),
      'fechaActualizacion': new FormControl('')
    });

    this.segundaPantallaForm = this.builder.group({
      'calleOE': new FormControl(''),
      'calleNS': new FormControl(''),
      'norteMovil': new FormControl(0),
      'esteMovil': new FormControl(0),
      'cotaMovil': new FormControl(0),
      'norteTopo': new FormControl(0),
      'esteTopo': new FormControl(0),
      'cotaTopo': new FormControl(0),
      'zona': new FormControl(''),
      'srid': new FormControl(0),
      'calzada': new FormControl('')
    });

    this.terceraPantallaForm = this.builder.group({
      'dimensionTapa': new FormControl(0),
      'altura': new FormControl(0),
      'ancho': new FormControl(0),
      'fluido': new FormControl(''),
      'estado': new FormControl(''),
      'observacion': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.idPozo = params['idPozo'];
      this.edicion = this.idPozo != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      forkJoin({
        sectoresSelect: this.sectorService.listarTodos(),
        responsablesSelect: this.responsableService.listarTodos(),
        descargasSelect: this.descargaService.listarTodos(),
        pozoSelect: this.pozoService.listarPorId(this.idPozo)
      }).subscribe(({ sectoresSelect, responsablesSelect, descargasSelect, pozoSelect }) => {
        this.sectores = sectoresSelect;

        this.responsables = responsablesSelect;

        this.descargas = descargasSelect;

        this.primeraPantallaForm.patchValue({
          'idPozo': pozoSelect.idPozo,
          'nombre': pozoSelect.nombre,
          'tapado': pozoSelect.tapado,
          'sistema': pozoSelect.sistema,
          'sectorSelect': pozoSelect.sector.idSector,
          'responsableSelect': pozoSelect.responsable.idResponsable,
          'descargaSelect': pozoSelect.descarga.idDescarga,
          'fechaCatastro': pozoSelect.fechaCatastro,
          'fechaActualizacion': pozoSelect.fechaActualizacion
        });

        this.segundaPantallaForm.patchValue({
          'calleOE': pozoSelect.calleOE,
          'calleNS': pozoSelect.calleNS,
          'norteMovil': pozoSelect.norteMovil,
          'esteMovil': pozoSelect.esteMovil,
          'cotaMovil': pozoSelect.cotaMovil,
          'norteTopo': pozoSelect.norteTopo,
          'esteTopo': pozoSelect.esteTopo,
          'cotaTopo': pozoSelect.cotaTopo,
          'zona': pozoSelect.zona,
          'srid': pozoSelect.srid,
          'calzada': pozoSelect.calzada
        });

        this.terceraPantallaForm.patchValue({
          'dimensionTapa': pozoSelect.dimensionTapa,
          'altura': pozoSelect.altura,
          'ancho': pozoSelect.ancho,
          'fluido': pozoSelect.fluido,
          'estado': pozoSelect.estado,
          'observacion': pozoSelect.observacion
        });
      });
    } else {
      this.sectorService.listarTodos().subscribe({
        next: data => {
          this.sectores = data;
        }
      });

      this.responsableService.listarTodos().subscribe({
        next: data => {
          this.responsables = data;
        }
      });

      this.descargaService.listarTodos().subscribe({
        next: data => {
          this.descargas = data;
        }
      });
    }
  }

  aceptar() {
    let sectorEnviar = new Sector();
    let responsableEnviar = new Responsable();
    let descargaEnviar = new Descarga();

    //Primera pantalla
    this.pozo.nombre = this.primeraPantallaForm.value['nombre'];
    this.pozo.tapado = this.primeraPantallaForm.value['tapado'];
    this.pozo.sistema = this.primeraPantallaForm.value['sistema'];
    sectorEnviar.idSector = this.primeraPantallaForm.value['sectorSelect'];
    responsableEnviar.idResponsable = this.primeraPantallaForm.value['responsableSelect'];
    descargaEnviar.idDescarga = this.primeraPantallaForm.value['descargaSelect'];
    this.pozo.sector = sectorEnviar;
    this.pozo.responsable = responsableEnviar;
    this.pozo.descarga = descargaEnviar;
    /*var tzoffsetCatastro = (this.primeraPantallaForm.value['fechaCatastro']).getTimezoneOffset() * 60000;
    var localISOTimeCatastro = (new Date(Date.now() - tzoffsetCatastro)).toISOString()
    this.pozo.fechaCatastro = localISOTimeCatastro;
    var tzoffsetActualizacion = (this.primeraPantallaForm.value['fechaActualizacion']).getTimezoneOffset() * 60000;
    var localISOTimeActualizacion = (new Date(Date.now() - tzoffsetActualizacion)).toISOString()
    this.pozo.fechaActualizacion = localISOTimeActualizacion;*/

    //Segunda pantalla
    this.pozo.calleOE = this.segundaPantallaForm.value['calleOE'];
    this.pozo.calleNS = this.segundaPantallaForm.value['calleNS'];
    this.pozo.norteMovil = this.segundaPantallaForm.value['norteMovil'];
    this.pozo.esteMovil = this.segundaPantallaForm.value['esteMovil'];
    this.pozo.cotaMovil = this.segundaPantallaForm.value['cotaMovil'];
    this.pozo.norteTopo = this.segundaPantallaForm.value['norteTopo'];
    this.pozo.esteTopo = this.segundaPantallaForm.value['esteTopo'];
    this.pozo.cotaTopo = this.segundaPantallaForm.value['cotaTopo'];
    this.pozo.zona = this.segundaPantallaForm.value['zona'];
    this.pozo.srid = this.segundaPantallaForm.value['srid'];
    this.pozo.calzada = this.segundaPantallaForm.value['calzada'];

    //Tercera pantalla
    this.pozo.dimensionTapa = this.terceraPantallaForm.value['dimensionTapa'];
    this.pozo.altura = this.terceraPantallaForm.value['altura'];
    this.pozo.ancho = this.terceraPantallaForm.value['ancho'];
    this.pozo.fluido = this.terceraPantallaForm.value['fluido'];
    this.pozo.estado = this.terceraPantallaForm.value['estado'];
    this.pozo.observacion = this.terceraPantallaForm.value['observacion'];
    this.pozo.actividadCompletada = 5;
    this.pozo.pathMedia = 'localhost';

    if (this.edicion) {
      this.pozo.idPozo = this.primeraPantallaForm.value['idPozo'];
      this.pozoService.modificar(this.pozo).subscribe(() => {
        Swal.fire({
          title: "INFO",
          text: "Registro actualizado",
          icon: "success"
        })
      });
    } else {
      this.pozoService.registrar(this.pozo).subscribe(() => {
        Swal.fire({
          title: "INFO",
          text: "Registro agregado",
          icon: "success"
        })
      });
    }
    this.router.navigate(['/pozo']);
  }
}