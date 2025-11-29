import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Responsable } from '../../../_model/responsable';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponsableService } from '../../../_service/responsable.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Rol } from '../../../_model/rol';
import { RolService } from '../../../_service/rol.service';

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

  roles: Rol[] = [];
  rolesSeleccionados: number[] = [];
  rolesCargados: boolean = false;

  constructor(private responsableService: ResponsableService, private rolService: RolService, private router: Router,
    private route: ActivatedRoute, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.responsable = new Responsable();

    this.form = new FormGroup({
      'idResponsable': new FormControl(0),
      'nombre': new FormControl('', Validators.required),
      'apellido': new FormControl('', Validators.required),
      'username': new FormControl('', Validators.required),
      'telefono': new FormControl('', Validators.required),
      'correo': new FormControl('', Validators.required),
      'password': new FormControl(''),
      'cambiarPassword': new FormControl(false),
      'roles': new FormControl([], Validators.required)
    });

    this.route.params.subscribe((params: Params) => {
      this.idResponsable = params['idResponsable'];
      this.edicion = this.idResponsable != null;
      this.initForm();
    });

    this.form.get('cambiarPassword')?.valueChanges.subscribe(value => {
      const passwordControl = this.form.get('password');
      if (this.edicion) {
        if (value) {
          passwordControl?.setValidators([Validators.required]);
        } else {
          passwordControl?.clearValidators();
        }
        passwordControl?.updateValueAndValidity();
      }
    });

    this.cargarRoles();
  }

  cargarRoles(): void {
    this.rolService.listarTodos().subscribe({
      next: (data: Rol[]) => {
        this.roles = data;
        this.rolesCargados = true;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.log('Error al cargar los roles: ', err.error.mensaje);
        this.rolesCargados = true;
        this.cdRef.detectChanges();
      }
    });
  }

  initForm() {
    if (this.edicion) {
      this.responsableService.listarPorId(this.idResponsable).subscribe({
        next: data => {
          const rolesIds = data.roles ? data.roles.map((rol: Rol) => rol.idRol) : [];
          this.form.patchValue({
            'idResponsable': data.idResponsable,
            'nombre': data.nombre,
            'apellido': data.apellido,
            'username': data.username,
            'telefono': data.telefono,
            'correo': data.correo,
            'roles': rolesIds
          });

          this.rolesSeleccionados = rolesIds;
          this.cdRef.detectChanges();

        }, error: err => {
          console.log(err.error.mensaje);
        }
      })
    }
  }

  onRoleChange(rolId: number, event: any): void {
    const isChecked = event.checked;

    if (isChecked) {
      // Agregar rol si no existe
      if (!this.rolesSeleccionados.includes(rolId)) {
        this.rolesSeleccionados.push(rolId);
      }
    } else {
      // Remover rol
      const index = this.rolesSeleccionados.indexOf(rolId);
      if (index > -1) {
        this.rolesSeleccionados.splice(index, 1);
      }
    }
    // Actualizar el form control
    this.form.patchValue({
      roles: this.rolesSeleccionados
    });

    this.form.get('roles')?.updateValueAndValidity();
  }

  isRoleSelected(roleId: number): boolean {
    return this.rolesSeleccionados.includes(roleId);
  }

  seleccionarTodos(event: any): void {
    const isChecked = event.checked;

    if (isChecked) {
      // Seleccionar todos los roles
      this.rolesSeleccionados = this.roles.map(rol => rol.idRol);
    } else {
      // Deseleccionar todos
      this.rolesSeleccionados = [];
    }

    this.form.patchValue({
      roles: this.rolesSeleccionados
    });

    this.form.get('roles')?.updateValueAndValidity();
  }

  estanTodosSeleccionados(): boolean {
    return this.roles.length > 0 && this.rolesSeleccionados.length === this.roles.length;
  }

  tieneErrorEnRoles(): boolean {
    const rolesControl = this.form.get('roles');
    return rolesControl ? rolesControl.invalid && rolesControl.touched : false;
  }

  operar() {
    this.responsable.nombre = this.form.value['nombre'];
    this.responsable.apellido = this.form.value['apellido'];
    this.responsable.username = this.form.value['username'];
    this.responsable.telefono = this.form.value['telefono'];
    this.responsable.habilitado = true;
    this.responsable.correo = this.form.value['correo'];

    // Asignar los roles seleccionados
    const rolesSeleccionados = this.roles.filter(rol =>
      this.rolesSeleccionados.includes(rol.idRol)
    );
    this.responsable.roles = rolesSeleccionados;

    if (this.edicion) {
      this.responsable.idResponsable = this.form.value['idResponsable'];
      if (this.form.value['cambiarPassword']) {
        this.responsable.password = this.form.value['password'];
      }
      this.responsableService.modificar(this.responsable).subscribe(() => {
        this.cambiarVariablesReactivas('Registro actualizado');
      });
    } else {
      this.responsable.password = this.form.value['password'];
      this.responsableService.registrar(this.responsable).subscribe(() => {
        this.cambiarVariablesReactivas('Registro agregado');
      });
    }
    this.router.navigate(['/responsable']);
  }

  cambiarVariablesReactivas(mensaje: string) {
    this.responsableService.listarTodos().subscribe(data => {
      this.responsableService.responsableCambio.next(data);
      this.responsableService.mensajeCambio.next(mensaje);
    });
  }
}