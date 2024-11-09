import { LocalStorageService } from './local.storage.service';
import { AlertServiceN } from './../components/alert-n/alert.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: "root" })
export class BaseService {
  private apiUrl: string = environment.apiUrlBase;
  public id: string = "1";
  constructor(private _http: HttpClient,
    private alertService: AlertServiceN,
    private localStorageService: LocalStorageService,
  ) {
    const data = JSON.parse(this.localStorageService.getItem("data"));
    if (data) {
      this.id = data.id;
    }
  }

  login(body: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}auth/login`, body).pipe(
      map(data => data.data),
      catchError(this.handleError.bind(this))
    );
  }
  setItem(key: string, value: string): void {
    this.localStorageService.setItem(key, value);
  }

  public handleError(error: HttpErrorResponse): Observable<never> {
    this.alertService.showAlert(error.error.message, "danger");
    return throwError(() => new Error(error.message));
  }
}


