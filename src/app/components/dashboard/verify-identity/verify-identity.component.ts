import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { ApiService } from 'src/app/shared/services/request-signature/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verify-identity',
  templateUrl: './verify-identity.component.html',
  styleUrl: './verify-identity.component.scss'
})
export class VerifyIdentityComponent implements OnInit{

  solicitudForm: FormGroup;
  randomTextNumber: string | null = null;
  private username = environment.authUsername;  // Usuario de la autenticación
  private password = environment.authPassword;  // Contraseña de la autenticación


  constructor(private fb: FormBuilder, private apiService: ApiService,private alertService: AlertService) {
    this.randomTextNumber = this.generateRandomTextNumber();
   }

  ngOnInit() {
    this.solicitudForm = this.fb.group({
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      cedula: ['', Validators.required],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.solicitudForm.valid) {
      const formData = this.solicitudForm.value;
  
      // Preparamos el cuerpo para la API
      const requestBody = {
        "url": "https://enext.cloud/firmador/links/generador/api/",
        "method": "POST",
        "headers": {
          "Authorization": "Basic YmlvbWV0cmlhOjEyMzQ1",
          "Content-Type": "application/json"
        },
        "body": {
          "noTramite": this.randomTextNumber,
          "certificado":{
            "perfil":"001",
            "cedula": formData.cedula,
            "nombres": `${formData.primerNombre} ${formData.segundoNombre}`,
            "apellido1": formData.primerApellido,
            "apellido2": formData.segundoApellido,
            "direccion": formData.direccion,
            "telefono": formData.telefono,
            "ciudad": formData.ciudad,
            "email": formData.email,
            "provincia": formData.provincia,
          }
        }
      };
  
      try {
        // Esperar la respuesta de la API
        const resp = await this.apiService.sendPostApiGenerica(requestBody);
        //console.log('Respuesta de la API:', resp);
        //console.log("vercodigo",resp.codigo);
        if (resp.codigo === "1"){
          const data={
            "link":resp.link,
            "correo":formData.email
          }

          //console.log("Datos a enviar ",data);
          var envio = await this.apiService.envioLinkCorreo(data);
          this.alertService.showAlert(envio.return, 'success');
          //console.log("Respuesta de envio de correo",envio.return);
          // Resetear el formulario
          this.solicitudForm.reset(); // Reinicia los campos del formulario
        }
        else{
          this.alertService.showAlert(envio.return, 'error');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    }
  }


  

  generateRandomTextNumber(): string {
    // Genera un número aleatorio de 6 dígitos y lo convierte a string
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber.toString(); // Convertir el número a string
  }

}
