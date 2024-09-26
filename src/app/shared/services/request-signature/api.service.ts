import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;  
  private envioCorreo = environment.enviocorreo;
  constructor(private http: HttpClient) {}
  private responseSubject = new Subject<any>();
  response$ = this.responseSubject.asObservable();

  // Método para hacer una solicitud GET
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);  // Utiliza la URL base del environment
  }

  sendPostApiGenerica(data: any): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
   
    // Retorna una Promise
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'generica', data, { headers })
        .subscribe(
          response => {
            // Resuelve la Promise con la respuesta
            console.log('Respuesta de la API GENERAR LINK:', response);
            resolve(response);
          },
          error => {
            console.error('Error details generar link:', error);
            reject(error); // Rechaza la Promise en caso de error
          }
        );
    });
  }
  
  envioLinkCorreo(data: any): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    return this.http.post(this.envioCorreo, data, { headers, responseType: 'text' })
      .toPromise()
      .then(response => {
        // Intentar parsear manualmente
        const jsonResponse = response.replace(/([a-zA-Z0-9_]+):/g, '"$1":'); // Pone las claves entre comillas
        return JSON.parse(jsonResponse);
      })
      .catch(error => {
        console.error('Error al enviar el correo:', error);
        throw error;
      });
  }
  
}
