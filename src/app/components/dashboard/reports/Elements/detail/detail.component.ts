import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AlertServiceN } from 'src/app/shared/components/alert-n/alert.service';
import { NgbdSortableHeader, SortEvent } from 'src/app/shared/directives/NgbdSortableHeader';
import { ApiService } from 'src/app/shared/services/request-signature/api.service';
import { TableService } from 'src/app/shared/services/table.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {

  @Input() numTramite: any;

  detalleClientes: any = [];
  // variables de tabla
  public tableItem$: Observable<any[]> = of([]);
  total$: Observable<number> = of(0);
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(public service: TableService,
    private alertService: AlertServiceN,
    private apiService: ApiService,
  ) { }

  async ngOnInit(): Promise<void> {
    console.log("Document ID recibido como @Input:", this.numTramite);
    this.loadDataTable();
  }

  private async loadDataTable(): Promise<void> {
    // Preparamos el cuerpo para la API
    const requestBody = {
      "url": "https://enext.cloud/firmador/admin/Consulta/consultaBase64.php",
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
      console.log(this.detalleClientes);
      this.tableItem$ = of(this.detalleClientes);
      this.service.setUserData(this.detalleClientes); // Actualiza el servicio con los nuevos datos
      this.tableItem$ = this.service.tableItem$;
      this.total$ = this.service.total$;
      //console.log("vercodigo",resp.codigo);
      this.alertService.showAlert("proceso exitoso", 'success');
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
}
