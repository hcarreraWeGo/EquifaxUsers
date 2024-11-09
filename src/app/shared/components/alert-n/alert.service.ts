import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Alert {
  message: string;
  type: 'success' | 'danger' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class AlertServiceN {
  private alertSubject = new Subject<Alert>();
  alert$ = this.alertSubject.asObservable();

  showAlert(message: string, type: 'success' | 'danger' | 'info') {
    const alert: Alert = { message, type };
    this.alertSubject.next(alert);
    console.log("si estoy aqui");
  }
}
