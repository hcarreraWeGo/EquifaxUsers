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
  constructor(private fb: FormBuilder, private apiService: ApiService) {
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

  onSubmit() {
    if (this.solicitudForm.valid) {
      const formData = this.solicitudForm.value;

      // Preparamos el cuerpo para la API
      const requestBody = {
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
      };

      // Llamar al servicio API
      const resp = this.apiService.sendPostEnlaceFirmaDocumento(requestBody);

      console.log('Respuesta de la API:', resp);
    }

  }

  generateRandomTextNumber(): string {
    // Genera un número aleatorio de 6 dígitos y lo convierte a string
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber.toString(); // Convertir el número a string
  }
}
