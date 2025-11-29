import { Component, OnInit } from '@angular/core';
import { LoginService } from '../_service/login.service';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { MenuService } from '../_service/menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form!: FormGroup;
  hidePassword: boolean = true;

  username: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private menuService: MenuService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  iniciarSesion() {
    if (this.form.invalid) {
      return;
    }
    this.username = this.form.value['username'];
    this.password = this.form.value['password'];
    this.loginService.login({ username: this.username, password: this.password }).subscribe({
      next: (data) => {
        if (data) {
          sessionStorage.setItem(environment.TOKEN_NAME, data.token);
          const usuarioToken = this.loginService.obtenerUsuario();
          this.menuService.listarPorUsuario(usuarioToken).subscribe({
            next: (data) => {
              this.menuService.menuCambio.next(data);
            }
          });
          this.router.navigate(['/mapa']);
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: 'Usuario o contraseña incorrectos'
        });
      }
    });
  }
}