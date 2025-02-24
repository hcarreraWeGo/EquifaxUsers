import { DashboardService } from './../dashboard.service';
import { ApiService } from './../../../shared/services/request-signature/api.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertServiceN } from '../../../shared/components/alert-n/alert.service';



@Component({
  selector: 'app-request-signature',
  templateUrl: './request-signature.component.html',
  styleUrl: './request-signature.component.scss'
})
export class RequestSignatureComponent implements OnInit {
  solicitudForm: FormGroup;
  randomTextNumber: string | null = null;
  isLoading: boolean = false;

  provincias: string[] = ['Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe'];
  ciudades: string[] = [];

  provinciasYciudades: { [key: string]: string[] } = {
    'Azuay': [
      'Cuenca', 'Girón', 'Gualaceo', 'Nabón', 'Paute', 'Pucará', 'San Fernando',
      'Santa Isabel', 'Sigsig', 'Oña', 'Chordeleg', 'El Pan', 'Sevilla de Oro',
      'Guachapala', 'Camilo Ponce Enríquez'
    ],
    'Bolívar': [
      'Guaranda', 'Chillanes', 'Chimbo', 'Echeandía', 'San Miguel', 'Caluma',
      'Las Naves'
    ],
    'Cañar': [
      'Azogues', 'Biblián', 'Cañar', 'La Troncal', 'El Tambo', 'Déleg', 'Suscal'
    ],
    'Carchi': [
      'Tulcán', 'Bolívar', 'Espejo', 'Mira', 'Montúfar', 'San Pedro de Huaca'
    ],
    'Chimborazo': [
      'Riobamba', 'Alausí', 'Colta', 'Chambo', 'Chunchi', 'Guamote', 'Guano',
      'Pallatanga', 'Penipe', 'Cumandá'
    ],
    'Cotopaxi': [
      'Latacunga', 'La Maná', 'Pangua', 'Pujilí', 'Salcedo', 'Saquisilí', 'Sigchos'
    ],
    'El Oro': [
      'Machala', 'Arenillas', 'Atahualpa', 'Balsas', 'Chilla', 'El Guabo',
      'Huaquillas', 'Marcabelí', 'Pasaje', 'Piñas', 'Portovelo', 'Santa Rosa',
      'Zaruma', 'Las Lajas'
    ],
    'Esmeraldas': [
      'Esmeraldas', 'Eloy Alfaro', 'Muisne', 'Quinindé', 'San Lorenzo', 'Atacames',
      'Rioverde', 'La Concordia'
    ],
    'Galápagos': [
      'Puerto Baquerizo Moreno', 'Puerto Ayora', 'Puerto Villamil'
    ],
    'Guayas': [
      'Guayaquil', 'Alfredo Baquerizo Moreno (Jujan)', 'Balao', 'Balzar', 'Colimes',
      'Daule', 'Durán', 'El Empalme', 'El Triunfo', 'Milagro', 'Naranjal',
      'Naranjito', 'Palestina', 'Pedro Carbo', 'Playas (General Villamil)',
      'Salitre (Urbina Jado)', 'Samborondón', 'Santa Lucía', 'Simón Bolívar',
      'Yaguachi', 'Marcelino Maridueña', 'Lomas de Sargentillo', 'Isidro Ayora'
    ],
    'Imbabura': [
      'Ibarra', 'Antonio Ante', 'Cotacachi', 'Otavalo', 'Pimampiro',
      'San Miguel de Urcuquí'
    ],
    'Loja': [
      'Loja', 'Calvas', 'Catamayo', 'Celica', 'Chaguarpamba', 'Espíndola',
      'Gonzanamá', 'Macará', 'Olmedo', 'Paltas', 'Pindal', 'Puyango', 'Quilanga',
      'Saraguro', 'Sozoranga', 'Zapotillo'
    ],
    'Los Ríos': [
      'Babahoyo', 'Baba', 'Buena Fe', 'Mocache', 'Montalvo', 'Palenque',
      'Puebloviejo', 'Quevedo', 'Quinsaloma', 'Urdaneta', 'Valencia', 'Ventanas',
      'Vinces'
    ],
    'Manabí': [
      'Portoviejo', 'Bolívar', 'Chone', 'El Carmen', 'Flavio Alfaro', 'Jipijapa',
      'Jama', 'Jaramijó', 'Junín', 'Manta', 'Montecristi', 'Olmedo', 'Paján',
      'Pichincha', 'Puerto López', 'Rocafuerte', 'San Vicente', 'Santa Ana',
      'Sucre', 'Tosagua', '24 de Mayo', 'Pedernales'
    ],
    'Morona Santiago': [
      'Macas', 'Gualaquiza', 'Huamboya', 'Limón Indanza', 'Logroño', 'Morona',
      'Pablo Sexto', 'Palora', 'San Juan Bosco', 'Santiago', 'Sucúa', 'Taisha',
      'Tiwintza'
    ],
    'Napo': [
      'Tena', 'Archidona', 'Carlos Julio Arosemena Tola', 'El Chaco', 'Quijos'
    ],
    'Orellana': [
      'Francisco de Orellana (El Coca)', 'Aguarico', 'La Joya de los Sachas',
      'Loreto'
    ],
    'Pastaza': [
      'Puyo', 'Arajuno', 'Mera', 'Santa Clara'
    ],
    'Pichincha': [
      'Quito', 'Cayambe', 'Mejía', 'Pedro Moncayo', 'Pedro Vicente Maldonado',
      'Puerto Quito', 'Rumiñahui', 'San Miguel de los Bancos'
    ],
    'Santa Elena': [
      'Santa Elena', 'La Libertad', 'Salinas'
    ],
    'Santo Domingo de los Tsáchilas': [
      'Santo Domingo', 'La Concordia'
    ],
    'Sucumbíos': [
      'Nueva Loja', 'Cascales', 'Cuyabeno', 'Gonzalo Pizarro', 'Lago Agrio',
      'Putumayo', 'Shushufindi', 'Sucumbíos'
    ],
    'Tungurahua': [
      'Ambato', 'Baños de Agua Santa', 'Cevallos', 'Mocha', 'Patate', 'Quero',
      'San Pedro de Pelileo', 'Santiago de Píllaro', 'Tisaleo'
    ],
    'Zamora Chinchipe': [
      'Zamora', 'Centinela del Cóndor', 'Chinchipe', 'El Pangui', 'Nangaritza',
      'Palanda', 'Paquisha', 'Yacuambi', 'Yantzaza'
    ]
  };



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
      ciudad: ['', [
        Validators.required,

      ]
      ], // Solo letras
      provincia: ['', [
        Validators.required,

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
    this.isLoading = true;
    if (this.solicitudForm.valid) {
      const formData = this.solicitudForm.value;
      // Genera un nuevo número aleatorio en cada envío
      this.randomTextNumber = this.generateRandomTextNumber();
      // ingreso de cliente
      var nombres = formData.primerNombre + formData.segundoNombre;
      var apellidos = formData.primerApellido + formData.segundoApellido;

      const resp = await this.dashService.addCliente(nombres, apellidos, formData.cedula, this.randomTextNumber, formData.email, 1);

      const idCliente = resp.data[0].cliente.id;
      const idSolicitud = resp.data[0].solicitud.id

      const data = {
        idCliente: idCliente,
        idSolicitud: idSolicitud
      }
      const idPaquete = await this.dashService.getIdPaquete(data);
      //console.log(idPaquete);
      const numeroTramite = this.randomTextNumber + "-idSolcitud" + idSolicitud + "-idPaquete" + idPaquete.idPaquete;
      //generar pdf
      const texto = {
        "nombres": `${formData.primerNombre}  ${formData.segundoNombre}`,
        "apellidos": `${formData.primerApellido}  ${formData.segundoApellido}`,
        "cedula": formData.cedula,
        "empresa": localStorage.getItem('nombreEmpresa'),
        "correo": formData.email,
        "provincia": formData.provincia,
        "ciudad": formData.ciudad,
        "direccion": formData.direccion,
        "telefono": formData.telefono,
      }
      const generarTexto = await this.dashService.GenerarTexto(texto);
      //console.log(generarTexto.pdf.pdf_base64);
      
      
      // Preparamos el cuerpo para la API
      const requestBody = {
        "url": "https://enext.cloud/pre_equifax/links/generador/api/",
        "method": "POST",
        "headers": {
          "Authorization": "Basic RklSTUFET1JWMzpzdXBlcjk4Nw==",
          "Content-Type": "application/json"
        },
        "body": {
          "noTramite": numeroTramite,
          "documentos": [
            {
              "idDocumento": "documento1",
              "nombreDocEntrada": "Contrato Oportunidad.pdf",
              "nombreDocSalida": "signed_Contrato Oportunidad.pdf",
              "pdfBase64": generarTexto.pdf.pdf_base64
            }
          ],
          "firmantes": [
            {
              "cedula": formData.cedula,
              "nombres": `${formData.primerNombre}  ${formData.segundoNombre}`,
              "apellidos": `${formData.primerApellido}  ${formData.segundoApellido}`,
              "correo": formData.email,
              "provincia": formData.provincia,
              "ciudad": formData.ciudad,
              "direccion": formData.direccion,
              "telefono": formData.telefono,
              "firmas": {
                "documento1": {
                  "firma1": {
                    "pagina": "1",
                    "posX": "8",
                    "posY": "8"
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
        //console.log("vercodigo",resp.codigo);
        if (resp.codigo === "1") {
          const data = {
            "link": resp.linkPrimerFirmante,
            "correo": formData.email
          }

          // Envio de correo
          var envio = await this.apiService.envioLinkCorreo(data);
          console.log(envio);
          if (envio.statusCode == 202) {
            this.isLoading = false;
            this.alertService.showAlert('Correo enviado', 'success');
            this.solicitudForm.reset(); // Reinicia los campos del formulario
          }

        }
        else {
          this.isLoading = false;
          this.alertService.showAlert(envio.return, 'danger');
        }
      } catch (error) {
        this.isLoading = false;
        this.alertService.showAlert("Tenemos un inconveniente, intentalo mas tarde", 'danger');
        console.error('Error al llamar a la API:', error);
      }
    }
  }

  onProvinciaChange() {
    const selectedProvincia = this.solicitudForm.get('provincia')?.value;
    this.ciudades = selectedProvincia ? this.provinciasYciudades[selectedProvincia] : [];
    this.solicitudForm.get('ciudad')?.reset();
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
