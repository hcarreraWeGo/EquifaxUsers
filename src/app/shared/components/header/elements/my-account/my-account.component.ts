import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BaseService } from "../../../../services/base.service";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit {
  public userName: string;
  public profileImg: "assets/images/dashboard/profile.jpg";

  constructor(public router: Router,
    private authService: BaseService
  ) {

  }

  ngOnInit():void {
     // Recupera el valor de 'usuario' desde localStorage
     const usuario = localStorage.getItem('usuario');
    //  console.log(usuario);
     // Si el valor existe, parsea el JSON y accede al email
     if (usuario) {
       const userData = JSON.parse(usuario);
       this.userName = userData.nombre;  // Aquí accedes al email
       //console.log('Email recuperado:', this.userName); // Muestra el email en la consola
     }
  }

  logoutFunc(): void {
    this.authService.logout(); // Asegúrate de inyectar el servicio en el componente
  }
}
