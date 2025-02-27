import { ChangeDetectorRef, Component } from '@angular/core';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  public userName: string;

constructor(private cdr: ChangeDetectorRef){}
  ngOnInit():void {
    // Recupera el valor de 'usuario' desde localStorage
    const usuario = sessionStorage.getItem('nombreEmpresa');
    console.log(usuario);
    // Si el valor existe, parsea el JSON y accede al email
    if (usuario) {
      this.userName = usuario;  // Aquí accedes al email
      //console.log('Email recuperado:', this.userName); // Muestra el email en la consola
    }
    this.cdr.detectChanges();
 }
}
