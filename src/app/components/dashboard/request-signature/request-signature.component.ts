import { DashboardService } from './../dashboard.service';
import { AlertService } from './../../../shared/components/alert/alert.service';
import { ApiService } from './../../../shared/services/request-signature/api.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertServiceN } from 'src/app/shared/components/alert-n/alert.service';



@Component({
  selector: 'app-request-signature',
  templateUrl: './request-signature.component.html',
  styleUrl: './request-signature.component.scss'
})
export class RequestSignatureComponent implements OnInit {
  solicitudForm: FormGroup;
  randomTextNumber: string | null = null;


  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: AlertServiceN,
    private dashService: DashboardService) {
    this.randomTextNumber = this.generateRandomTextNumber();
  }

  ngOnInit() {
    this.solicitudForm = this.fb.group({
      primerNombre: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]
      ], // Solo letras
      segundoNombre: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]
      ], // Solo letras
      primerApellido: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]
      ], // Solo letras
      segundoApellido: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]
      ], // Solo letras
      cedula: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]
      ], // Solo números, exactamente 10 dígitos
      ciudad: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]
      ], // Solo letras
      provincia: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]
      ], // Solo letras
      direccion: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email
      ]
      ],// Validación de correo
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]
      ] // Solo números, exactamente 10 dígitos
    });
  }

  async onSubmit() {
    if (this.solicitudForm.valid) {
      const formData = this.solicitudForm.value;
      // Genera un nuevo número aleatorio en cada envío
      this.randomTextNumber = this.generateRandomTextNumber();
      // ingreso de cliente
      var nombres = formData.primerNombre + formData.segundoNombre;
      var apellidos = formData.primerApellido + formData.segundoApellido;
      await this.dashService.addCliente(nombres, apellidos, formData.cedula, this.randomTextNumber, formData.email, 1);
      // Preparamos el cuerpo para la API
      const requestBody = {
        "url": "https://enext.cloud/pre_equifax/links/generador/api/",
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
                    "pagina": "1",
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
        console.log('Respuesta de la API:', resp);
        //console.log("vercodigo",resp.codigo);
        if (resp.codigo === "1") {
          const data = {
            "link": resp.linkPrimerFirmante,
            "correo": formData.email
          }

          // Envio de correo
          var envio = await this.apiService.envioLinkCorreo(data);
          this.alertService.showAlert('Correo enviado', 'success');

          //console.log("Respuesta de envio de correo",envio.return);
          // Resetear el formulario
          this.solicitudForm.reset(); // Reinicia los campos del formulario
        }
        else {
          this.alertService.showAlert(envio.return, 'danger');
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

  // VALIDACIONES 
  getCedulaErrorMessage(control: AbstractControl | null): string {
    if (control?.hasError('required')) {
      return 'La cédula es requerida.';
    } else if (control?.hasError('pattern')) {
      return 'La cédula debe contener solo números.';
    } else if (control?.hasError('minlength') || control?.hasError('maxlength')) {
      return 'La cédula debe tener exactamente 10 dígitos.';
    }
    return '';
  }

  getLetrasErrorMessage(control: AbstractControl | null): string {
    if (control?.hasError('required')) {
      return 'Este campo es requerido.';
    } else if (control?.hasError('pattern')) {
      return 'El campo solo debe contener letras.';
    }
    return '';
  }
  getTelefonoErrorMessage(control: AbstractControl | null): string {
    if (control?.hasError('required')) {
      return 'El telefono es requerido.';
    } else if (control?.hasError('pattern')) {
      return 'El telefono debe contener solo números.';
    } else if (control?.hasError('minlength') || control?.hasError('maxlength')) {
      return 'La telefono debe tener exactamente 10 dígitos.';
    }
    return '';
  }
  getCorreoErrorMessage(control: AbstractControl | null): string {
    if (control?.hasError('required')) {
      return 'El correo es requerido.';
    } else if (control?.hasError('email')) {
      return 'La correo es invalido.';
    }
    return '';
  }
}
