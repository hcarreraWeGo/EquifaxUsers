import { LocalStorageService } from './local.storage.service';
import { AlertServiceN } from './../components/alert-n/alert.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({ providedIn: "root" })
export class BaseService {
  private apiUrl: string = environment.apiUrlBase;
  public id: string = "1";
  public idEmpresa: string = "1";
  constructor(private _http: HttpClient,
    private alertService: AlertServiceN,
    private localStorageService: LocalStorageService,
    private router: Router

  ) {
    const data = JSON.parse(this.localStorageService.getItem("data"));
    if (data) {
      this.id = data.id;
      this.idEmpresa= data.idEmpresa;
    }
  }

  // login(body: any): Observable<any> {
  //   return this._http.post<any>(`${this.apiUrl}auth/login`, body).pipe(
  //     map(data => data.data),
  //     catchError(this.handleError.bind(this))
  //   );
  // }
  login(body: any): Observable<any> {
    
    return this._http.post<any>(`${this.apiUrl}auth/login`, body).pipe(
      map(data => {
        // Almacena el token
        if (data && data.data && data.data.token) {
          localStorage.setItem('token', data.data.token); // O usa sessionStorage
          //console.log(data.data.token);
        }
        return data.data;
      }),
      catchError(this.handleError.bind(this))
    );
  }
  logout(): void {
    // Limpia el almacenamiento local y de sesión
    this.localStorageService.clearAll();
    sessionStorage.clear();
    // Redirige al usuario al login y modifica el historial
    this.router.navigateByUrl('/auth/login').then(() => {
      // Evita que el usuario retroceda a la página anterior
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        history.go(1); // Previene que el usuario use el botón "Atrás"
      };
    });
  }

  post(service: string, body: any): Observable<any> {
    // console.log(`${this.apiUrl}${service}`)
    return this._http.post<any>(`${this.apiUrl}${service}`, body).pipe(
      map(data => data),
      catchError(this.handleError.bind(this))
    );
  }
  get(service: string): Observable<any> {
    // console.log(`${this.apiUrl}${service}`)
    return this._http.get<any>(`${this.apiUrl}${service}`).pipe(
      map(data => data.data),
      catchError(this.handleError.bind(this))
    );
  }
  get1(service: string): Observable<any> {
    // console.log(`${this.apiUrl}${service}`)
    return this._http.get<any>(`${this.apiUrl}${service}`).pipe(
      map(data => data),
      catchError(this.handleError.bind(this))
    );
  }
  setItem(key: string, value: string): void {
    this.localStorageService.setItem(key, value);
  }

  public handleError(error: HttpErrorResponse): Observable<never> {
    this.alertService.showAlert(error.error.message, "danger");
    // console.log(error.error.message, "danger");
    return throwError(() => new Error(error.message));
  }
}


