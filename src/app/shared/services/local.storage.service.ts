import { Injectable } from "@angular/core";
import { StorageService } from "./storage";

@Injectable({
    providedIn: 'root'
  })
  export class LocalStorageService {
  
    constructor(private storageService: StorageService) { }
    // Set the json data to local
    setItem(key: string, value: any) {
      this.storageService.secureStorage.setItem(key, value);
    }
    // Get the json value from local
    getItem(key: string) {
      return this.storageService.secureStorage.getItem(key);
    }// Clear the local
    clearAll() {
      return this.storageService.secureStorage.clear();
    }
    
  }