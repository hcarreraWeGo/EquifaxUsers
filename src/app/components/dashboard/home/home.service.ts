import { Injectable } from '@angular/core';
import { BaseService } from './../../../shared/services/base.service';

@Injectable({ providedIn: "root" })
export class HomeService {
  constructor(private baseService: BaseService) {}

  async getTotalFirma(): Promise<any> {
    console.log(this.baseService.id);
    return await this.baseService
      .get1(`paquete-transacciones/total/${this.baseService.id}/1`)
      .toPromise();
  }

  async getTotalIdentidad(): Promise<any> {
    return await this.baseService
      .get1(`paquete-transacciones/total/${this.baseService.id}/2`)
      .toPromise();
  }

  async getRestanteFirma(): Promise<any> {
    return await this.baseService
      .get1(`paquete-transacciones/restantes/${this.baseService.id}/1`)
      .toPromise();
  }
  async getRestanteIdentidad(): Promise<any> {
    return await this.baseService
      .get1(`paquete-transacciones/restantes/${this.baseService.id}/2`)
      .toPromise();
  }
}