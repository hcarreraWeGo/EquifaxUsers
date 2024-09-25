import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Alert {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<Alert>();
  alert$ = this.alertSubject.asObservable();

  showAlert(message: string, type: 'success' | 'error' | 'info') {
    const alert: Alert = { message, type };
    this.alertSubject.next(alert);
  }
}
