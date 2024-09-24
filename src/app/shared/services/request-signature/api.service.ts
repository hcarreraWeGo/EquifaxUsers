import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;  // URL base tomada del archivo de entorno
  private username = environment.authUsername;  // Usuario de la autenticación
  private password = environment.authPassword;  // Contraseña de la autenticación
  constructor(private http: HttpClient) {}

  // Método para hacer una solicitud GET
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);  // Utiliza la URL base del environment
  }

  sendPostEnlaceFirmaDocumento(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('FIRMADORV3:super987'), // Asegúrate de que esta línea esté correcta
      'Cookie': 'PHPSESSID=frgk0m60iqqq4juj4khl4ial0b' // Si es necesario, puedes incluir las cookies aquí
    });

    console.log('Request Body:', data);
    console.log('Request Headers:', headers);

    return this.http.post(this.apiUrl, data, {
      headers,
      withCredentials: true // Asegúrate de incluir esta opción si es necesario
    }).subscribe(
      response => {
        console.log('Success:', response);
      },
      error => {
        console.error('Error details:', error);
      }
    );
  }
}
