import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from './home.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  
  constructor(calendar: NgbCalendar,
    private homeservice: HomeService,
    private cdr: ChangeDetectorRef
  ) {}
  public totalFirmas = {};
  public totalIdentidad = {};
  public restanteFirmas = {};
  public restantesIdentidad = {};
  async ngOnInit(): Promise<void> {
    const totalFirmasResponse = await this.homeservice.getTotalFirma();
    // console.log("verificar el consumo 1",totalFirmasResponse);
    this.totalFirmas = this.transformToTargetStructure(totalFirmasResponse.saldoTotal, 'Total Firmas');

    const restanteFirmasResponse = await this.homeservice.getRestanteFirma();
    // console.log("verificar el consumo 2",restanteFirmasResponse);
    this.restanteFirmas = this.transformToTargetStructure(restanteFirmasResponse.saldoDisponible, 'Firmas Restantes');
    
    const totalIdentidadResponse = await this.homeservice.getTotalIdentidad();
    // console.log("verificar el consumo 3",this.totalIdentidad);
    this.totalIdentidad = this.transformToTargetStructure(totalIdentidadResponse.saldoTotal, 'Total identidad');
    
    const restantesIdentidadResponse = await this.homeservice.getRestanteIdentidad();
    // console.log("verificar el consumo 4",restanteFirmasResponse);
    this.restantesIdentidad = this.transformToTargetStructure(restantesIdentidadResponse.saldoDisponible, 'Identidad Restante');
    
    this.cdr.detectChanges();
  }

  // Método para transformar la respuesta en la estructura requerida
  private transformToTargetStructure(counter: number, name: string): any {
    return {
      data: {
        icon: 'rate', // Este valor puede ser dinámico si lo necesitas
        counter: counter,
        name: name,
        font: 'primary',
        today: '0', // Puedes ajustar esto según tus necesidades
      },
    };
  }
}
