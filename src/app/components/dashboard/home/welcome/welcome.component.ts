import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  public userName: string;


  ngOnInit():void {
    // Recupera el valor de 'usuario' desde localStorage
    const usuario = localStorage.getItem('usuario');
    console.log(usuario);
    // Si el valor existe, parsea el JSON y accede al email
    if (usuario) {
      const userData = JSON.parse(usuario);
      this.userName = userData.nombre;  // Aquí accedes al email
      //console.log('Email recuperado:', this.userName); // Muestra el email en la consola
    }
 }
}
