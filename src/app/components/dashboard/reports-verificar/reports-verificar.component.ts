import { TableService } from './../../../shared/services/table.service';
import { DashboardService } from './../dashboard.service';
import { NgbdSortableHeader, SortEvent } from './../../../shared/directives/NgbdSortableHeader';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-reports-verificar',
  templateUrl: './reports-verificar.component.html',
  styleUrl: './reports-verificar.component.scss'
})
export class ReportsVerificarComponent {

  clientes: any = [];
  searchTerm: string = ''; // Nueva variable de búsqueda
  // variables de tabla
  public tableItem$: Observable<any[]> = of([]);
  total$: Observable<number> = of(0);
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  // abrir detalle
  showDetalle: boolean = false; 
  selectedTramite: any;
  selectedProceso: any;
  constructor(
    private dashService: DashboardService,
    public service: TableService,

  ) {
    
  }

  async ngOnInit(): Promise<void> {
    this.loadDataTable();
  }
  private async loadDataTable(): Promise<void> {
    this.clientes = await this.dashService.getClienteByUsuario(2);
    this.tableItem$ = of(this.clientes);
    this.service.setUserData(this.clientes); // Actualiza el servicio con los nuevos datos
    this.tableItem$ = this.service.tableItem$;
    this.total$ = this.service.total$;
    // console.log("respuesta de endpoint con los clientes retornando",this.clientes);

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
    this.loadDataTable(); // Recargar datos si es necesario para actualizar la vista
  }
  
  async openDetail(documentId,proceso) {
    // console.log(documentId);
    this.selectedTramite = documentId;
    this.selectedProceso=proceso;
    this.showDetalle = true;
  }
  closeViewer() {
    this.showDetalle = false;
    this.loadDataTable();
  }
  onSearch(): void {
    this.service.searchTerm = this.searchTerm; // Actualiza el término de búsqueda en el servicio
  }
}
