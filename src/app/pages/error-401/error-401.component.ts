import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../_service/login.service';

@Component({
  selector: 'app-error-401',
  standalone: false,
  templateUrl: './error-401.component.html',
  styleUrl: './error-401.component.css'
})
export class Error401Component implements OnInit {

  usuario: string = "";

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.usuario = this.loginService.obtenerUsuario();
  }
}