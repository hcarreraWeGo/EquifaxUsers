import { TableService } from './../../../../../shared/services/table.service';
import { ApiService } from './../../../../../shared/services/request-signature/api.service';
import { NgbdSortableHeader,SortEvent } from './../../../../../shared/directives/NgbdSortableHeader';
import { AlertServiceN } from './../../../../../shared/components/alert-n/alert.service';
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {

  private solicitar: string = environment.solicitar;
  private verificar: string = environment.verificar;
  // paso de variables que recibo desde reports o de donde le llame a mi componente
  @Input() numTramite: any;
  @Input() numProceso: any;
  detalleClientes: any = [];
  base64: any = [];
  // variables de tabla
  public tableItem$: Observable<any[]> = of([]);
  total$: Observable<number> = of(0);
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(public service: TableService,
    private alertService: AlertServiceN,
    private apiService: ApiService,
  ) { }

  async ngOnInit(): Promise<void> {
    console.log("Document ID tramite como @Input:", this.numTramite);
    console.log("Document ID proceso como @Input:", this.numProceso);
    //console.log(this.numTramite);
    this.loadDataTable();
  }

  private async loadDataTable(): Promise<void> { 
    // Preparamos el cuerpo para la API
    const requestBody = {
      "url": this.obtenerLink(this.numProceso),
      "method": "POST",
      "headers": {
        "Authorization": "Basic Y29uc3VsdGE6Y29uc3VsdGE5ODc=",
        "Content-Type": "application/json"
      },
      "body": {
        "idTramite": this.numTramite,
      }
    };
  
    try {
      // Esperar la respuesta de la API
      this.detalleClientes = [await this.apiService.sendPostApiGenerica(requestBody)];
      console.log("Datos obtenidos:", this.detalleClientes);
  
      // Acceder a la propiedad 'archivos' de la respuesta
      const archivos = this.detalleClientes[0]?.archivos;  // El primer objeto de la respuesta tiene la propiedad 'archivos'
  
      // Verificamos si 'archivos' tiene datos y si el ID del proceso es 1
      if (archivos && archivos.length > 0 && this.numProceso === 1) {
        console.log("Archivos:", archivos);
        const archivo = archivos[0];  // Si hay al menos un archivo, obtenemos el primero
      //  console.log("Contenido del archivo:", archivo.archivo);  // Base64 del archivo
  
       } else {
        console.log("No hay archivos disponibles o el ID de proceso no es 1");
      }
  
      // Fin del proceso
      this.tableItem$ = of(this.detalleClientes);
      this.service.setUserData(this.detalleClientes);  // Actualiza el servicio con los nuevos datos
      this.total$ = this.service.total$;
      this.alertService.showAlert("Proceso exitoso", 'success');
    } catch (error) {
      console.error('Error al llamar a la API:', error);
    }
  }
  

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }


  onPageSizeChange(newPageSize: number): void {
    this.service.pageSize = newPageSize;
    // console.log('Page size cambiado a:', newPageSize);
    //this.loadDataTable(); // Recargar datos si es necesario para actualizar la vista
  }
  obtenerLink(opcion: number): string {
    var url = {
      "solicitar": this.solicitar,
      "verificar": this.verificar
    }
    if (opcion === 1) {
      return url.solicitar;
    } else if (opcion === 2) {
      return url.verificar;
    } else {
      return "Opción no válida";
    }
  }

  downloadFile(archivo: any): void {
    if (archivo && archivo.archivo) {
      const byteCharacters = atob(archivo.archivo);  // Decodificar Base64
      const byteArrays = [];
  
      for (let offset = 0; offset < byteCharacters.length; offset++) {
        const byte = byteCharacters.charCodeAt(offset);
        byteArrays.push(byte);
      }
  
      // Crear un Blob a partir de los bytes y generar un enlace de descarga
      const blob = new Blob([new Uint8Array(byteArrays)], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = archivo.nombre_doc_salida;  // Nombre del archivo
      link.click();  // Iniciar la descarga
    } else {
      console.log("Archivo no disponible");
    }
  }
  
  
}
