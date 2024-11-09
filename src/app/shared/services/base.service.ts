import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: "root" })
export class BaseService {
private apiUrl: string = environment.apiUrlBase;

constructor(private _http: HttpClient,){}

login(body: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/auth/login`, body).pipe(
      map(data => data.data),
      catchError(this.handleError.bind(this))
    );
  }


  public handleError(error: HttpErrorResponse): Observable<never> {
    this.toastService.error(error.error.message, "Error");
    return throwError(() => new Error(error.message));
  }
}


