import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseService } from './../../../shared/services/base.service';

@Injectable({ providedIn: "root" })
export class HomeService {
  constructor(private baseService: BaseService) {}

  async getTotalFirma(): Promise<any> {
    console.log("id-home",this.baseService.id);
    console.log("idEmpresa-home",this.baseService.idEmpresa);
    return await this.baseService
      .get1(`empresas/procesos-total/${this.baseService.idEmpresa}/1`)
      .toPromise();
  }

  async getTotalIdentidad(): Promise<any> {
    return await this.baseService
      .get1(`empresas/procesos-total/${this.baseService.idEmpresa}/2`)
      .toPromise();
  }

  async getRestanteFirma(): Promise<any> {
    return await this.baseService
      .get1(`empresas/procesos-saldo/${this.baseService.idEmpresa}/1`)
      .toPromise();
  }
  async getRestanteIdentidad(): Promise<any> {
    return await this.baseService
      .get1(`empresas/procesos-saldo/${this.baseService.idEmpresa}/2`)
      .toPromise();
  }
  
}