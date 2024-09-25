import { Component } from '@angular/core';
import { AlertService } from './alert.service'; // Asegúrate de que la ruta sea correcta

interface Alert {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {
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
