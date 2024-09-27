import { AlertService } from './../../../shared/components/alert/alert.service';
import { ApiService } from './../../../shared/services/request-signature/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-request-signature',
  templateUrl: './request-signature.component.html',
  styleUrl: './request-signature.component.scss'
})
export class RequestSignatureComponent implements OnInit {
  solicitudForm: FormGroup;
  randomTextNumber: string | null = null;


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
        "url": "https://enext.cloud/pruebas/links/generador/api/",
        "method": "POST",
        "headers": {
          "Authorization": "Basic RklSTUFET1JWMzpzdXBlcjk4Nw==",
          "Content-Type": "application/json"
        },
        "body": {
          "noTramite": this.randomTextNumber,
          "documentos": [
            {
              "idDocumento": "documento1",
              "nombreDocEntrada": "Contrato Oportunidad.pdf",
              "nombreDocSalida": "signed_Contrato Oportunidad.pdf",
              "pdfBase64": "JVBERi0xLjUNCiW1tbW1DQoxIDAgb2JqDQo8PC9UeXBlL+Pg0Kc3RhcnR4cmVmDQoxODU4MzYNCiUlRU9GDQp4cmVmDQowIDANCnRyYWlsZXINCjw8L1NpemUgMTgvUm9vdCAxIDAgUi9JbmZvIDcgMCBSL0lEWzw0NTYwOTIwNTYxRUI1OTREQTU4NzkzOThGN0NGODMwOT48NDU2MDkyMDU2MUVCNTk0REE1ODc5Mzk4RjdDRjgzMDk+XSAvUHJldiAxODU4MzYvWFJlZlN0bSAxODU1NjY+Pg0Kc3RhcnR4cmVmDQoxODYzNTMNCiUlRU9G"
            }
          ],
          "firmantes": [
            {
              "cedula": formData.cedula,
              "nombres": `${formData.primerNombre} ${formData.segundoNombre}`,
              "apellidos": `${formData.primerApellido} ${formData.segundoApellido}`,
              "correo": formData.email,
              "provincia": formData.provincia,
              "ciudad": formData.ciudad,
              "direccion": formData.direccion,
              "telefono": formData.telefono,
              "firmas": {
                "documento1": {
                  "firma1": {
                    "pagina": "5",
                    "posX": "12",
                    "posY": "17"
                  }
                }
              }
            }
          ]
        }
      };
  
      try {
        // Esperar la respuesta de la API
        const resp = await this.apiService.sendPostApiGenerica(requestBody);
        //console.log('Respuesta de la API:', resp);
        //console.log("vercodigo",resp.codigo);
        if (resp.codigo === "1"){
          const data={
            "link":resp.linkPrimerFirmante,
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
