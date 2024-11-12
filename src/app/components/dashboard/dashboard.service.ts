import { BaseService } from './../../shared/services/base.service';

import { Injectable } from '@angular/core';



@Injectable({ providedIn: "root" })
export class DashboardService{
    constructor(private baseService: BaseService) {}

    async addNumTramite(cedula,numTramite): Promise<any> {
        try {
            const data={
                "cedula":cedula,
                "numTramite":numTramite
            }
          const response = await this.baseService.post(`cedula-tramite`,data).toPromise();
          console.log("Respuesta del servidor:", response);
          return response;
        } catch (error) {
          console.error("Error al enviar el firmante:", error);
          throw error;
        }
      }

      async addCliente(nombre,apellido,cedula,numTramite,email,idProceso): Promise<any> {
        try {
            const data={
                "nombre":nombre,
                "apellido":apellido,
                "cedula":cedula,
                "correo":email,
                "numTramite":numTramite,
                "idProceso":idProceso
            }
          const response = await this.baseService.post(`add-cliente`,data).toPromise();
          console.log("Respuesta del servidor:", response);
          return response;
        } catch (error) {
          console.error("Error al enviar el firmante:", error);
          throw error;
        }
      }
}