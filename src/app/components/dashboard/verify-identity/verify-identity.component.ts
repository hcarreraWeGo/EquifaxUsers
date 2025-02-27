import { ApiService } from './../../../shared/services/request-signature/api.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { AlertServiceN } from '../../../shared/components/alert-n/alert.service';
import { emailValidator } from '../../../shared/validators/email.validator';

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
        Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)
      ]
      ], // Solo letras
      segundoNombre: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)
      ]
      ], // Solo letras
      primerApellido: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)
      ]
      ], // Solo letras
      segundoApellido: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)
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
        Validators.email,
        emailValidator()
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
   
  
    if (!this.solicitudForm.valid) {
      this.alertService.showAlert("Formulario inválido", 'danger');
      return;
    }
  
    try {
      this.isLoading = true;
      // Generar número aleatorio
      this.randomTextNumber = this.generateRandomTextNumber();
      const formData = this.solicitudForm.value;
      const nombres = `${formData.primerNombre} ${formData.segundoNombre}`;
      const apellidos = `${formData.primerApellido} ${formData.segundoApellido}`;
  
    
      
  
      // Preparar datos para la API externa
      const requestBody = {
        url: "https://enext.cloud/firmador/links/generador/api/",
        method: "POST",
        headers: {
          "Authorization": "Basic YmlvbWV0cmlhOjEyMzQ1",
          "Content-Type": "application/json"
        },
        body: {
          "noTramite": this.randomTextNumber,
          "certificado": {
            "perfil": "001",
            "cedula": formData.cedula,
            "nombres": nombres,
            "apellido1": formData.primerApellido,
            "apellido2": formData.segundoApellido,
            "direccion": "quitumbe",
            "telefono": formData.telefono,
            "ciudad": "quito",
            "email": formData.email,
            "provincia": "pichincha"
          }
        }
      };
  
      // Llamar a la API externa
      const apiResp = await this.apiService.sendPostApiGenerica(requestBody);
      if (apiResp.codigo !== "1") {
        throw new Error("Error en la API externa");
      }
  
      // Enviar correo con el link generado
      const emailData = { link: apiResp.link, correo: formData.email };
      const emailResp = await this.apiService.envioLinkCorreo(emailData);
      if (emailResp.statusCode !== 202) {
        throw new Error("Error al enviar el correo");
      }
  
      // Guardar cliente al final del proceso
      const clienteResp = await this.dashService.addCliente(nombres, apellidos, formData.cedula, this.randomTextNumber, formData.email, 2);
      if (clienteResp?.status === 201) {
        this.solicitudForm.reset();
        await this.alertService.showAlert("Correo enviado", 'success');
        
      } else {
        await this.alertService.showAlert("Error al guardar al cliente", 'danger');
        throw new Error("Error al guardar el cliente");
      }
    } catch (error) {
      await this.alertService.showAlert("Tenemos un inconveniente, inténtalo más tarde", 'danger');
      console.error("Error en onSubmit:", error);
  
    } finally {
      // Se ejecuta siempre, asegurando que el loading se desactive
      this.isLoading = false;
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
