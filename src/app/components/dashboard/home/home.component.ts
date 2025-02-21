import { Component, OnInit } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as data from "../../../shared/data/router-animation/default"
import { HomeService } from './home.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  
  constructor(calendar: NgbCalendar,
    private homeservice: HomeService
  ) {}
  public totalFirmas = {};
  public totalIdentidad = {};
  public restanteFirmas = {};
  public restantesIdentidad = {};
  async ngOnInit(): Promise<void> {
    const totalFirmasResponse = await this.homeservice.getTotalFirma();
    
    this.totalFirmas = this.transformToTargetStructure(totalFirmasResponse.saldoTotal, 'Total Firmas');

    const restanteFirmasResponse = await this.homeservice.getRestanteFirma();
    this.restanteFirmas = this.transformToTargetStructure(restanteFirmasResponse.saldoDisponible, 'Firmas Restantes');

    const totalIdentidadResponse = await this.homeservice.getTotalIdentidad();
    this.totalIdentidad = this.transformToTargetStructure(totalIdentidadResponse.saldoTotal, 'Total identidad');

    const restantesIdentidadResponse = await this.homeservice.getRestanteIdentidad();
    this.restantesIdentidad = this.transformToTargetStructure(restantesIdentidadResponse.saldoDisponible, 'Identidad Restante');
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
