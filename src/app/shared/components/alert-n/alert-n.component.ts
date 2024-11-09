import { Component } from '@angular/core';
import { AlertServiceN } from './alert.service';


interface Alert {
  message: string;
  type: 'success' | 'danger' | 'info';
}
@Component({
  selector: 'app-alert-n',
  templateUrl: './alert-n.component.html',
  styleUrl: './alert-n.component.scss'
})
export class AlertNComponent {

  alerts: Alert[] = [];

  constructor(private alertService: AlertServiceN) {
    // Nos suscribimos al servicio para recibir las alertas dinámicamente
    this.alertService.alert$.subscribe(alert => {
      this.alerts.push(alert);
      // Configurar un temporizador si deseas que la alerta desaparezca automáticamente después de cierto tiempo
      setTimeout(() => this.close(alert), 5000); // Ejemplo de cierre automático en 5 segundos
    });
  }

  close(alert: Alert) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }


}
