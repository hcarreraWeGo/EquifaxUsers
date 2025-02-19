import { ApiService } from './../../../shared/services/request-signature/api.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { AlertServiceN } from '../../../shared/components/alert-n/alert.service';

@Component({
  selector: 'app-verify-identity',
  templateUrl: './verify-identity.component.html',
  styleUrl: './verify-identity.component.scss'
})
export class VerifyIdentityComponent implements OnInit {

  solicitudForm: FormGroup;
  randomTextNumber: string | null = null;
  isLoading: boolean = false;

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
    this.isLoading=true;
    if (this.solicitudForm.valid) {
      // Genera un nuevo número aleatorio en cada envío
      this.randomTextNumber = this.generateRandomTextNumber();
      const formData = this.solicitudForm.value;
      // AGREGAMOS A LA BDD
      var nombres = formData.primerNombre + formData.segundoNombre;
      var apellidos = formData.primerApellido + formData.segundoApellido;
      const resp= await this.dashService.addCliente(nombres, apellidos, formData.cedula, this.randomTextNumber, formData.email, 2);
      const idCliente= resp.data[0].cliente.id;
      const idSolicitud = resp.data[0].solicitud.id
      
      const data={
        idCliente:idCliente, 
        idSolicitud:idSolicitud
      }
      const idPaquete= await this.dashService.getIdPaquete(data);
      //console.log(idPaquete);
      const numeroTramite= this.randomTextNumber + "-idSolcitud"+idSolicitud+"-idPaquete"+idPaquete.idPaquete;
      // Preparamos el cuerpo para la API
      const requestBody = {
        "url": "https://enext.cloud/firmador/links/generador/api/",
        "method": "POST",
        "headers": {
          "Authorization": "Basic YmlvbWV0cmlhOjEyMzQ1",
          "Content-Type": "application/json"
        },
        "body": {
          "noTramite": numeroTramite,
          "certificado": {
            "perfil": "001",
            "cedula": formData.cedula,
            "nombres": `${formData.primerNombre}  ${formData.segundoNombre}`,
            "apellido1": formData.primerApellido,
            "apellido2": formData.segundoApellido,
            "direccion": "quitumbe",
            "telefono": formData.telefono,
            "ciudad": "quito",
            "email": formData.email,
            "provincia": "pichincha",
          }
        }
      };

      try {

        // Esperar la respuesta de la API
        const resp = await this.apiService.sendPostApiGenerica(requestBody);
        //console.log('Respuesta de la API:', resp);
        //console.log("vercodigo",resp.codigo);
        if (resp.codigo === "1") {
          const data = {
            "link": resp.link,
            "correo": formData.email
          }

          // envio correo
          var envio = await this.apiService.envioLinkCorreo(data);
          // console.log(envio);
          if(envio.statusCode == 202){
            this.isLoading=false;
            this.alertService.showAlert("proceso exitoso", 'success');
            this.solicitudForm.reset();
          }
         
          
        }
        else {
          this.isLoading=false;
          this.alertService.showAlert(envio.return, 'danger');
        }
      } catch (error) {
        this.isLoading=false;
        this.alertService.showAlert("Tenemos un inconveniente, intentalo mas tarde", 'danger');
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
