import { Injectable } from "@angular/core";
import { StorageService } from "./storage";


@Injectable({
    providedIn: 'root'
  })
export class SessionStorageService {
  
  constructor(private storageService: StorageService) {
   
  }

  // Establecer datos en sessionStorage
  setItem(key: string, value: any): void {
    this.storageService.secureStorage.setItem(key, value);
  }

  // Obtener datos desde sessionStorage
  getItem(key: string): any {
    return this.storageService.secureStorage.getItem(key);
  }

  // Limpiar el almacenamiento (sessionStorage)
  clearAll(): void {
    return this.storageService.secureStorage.clear();
  }
}
