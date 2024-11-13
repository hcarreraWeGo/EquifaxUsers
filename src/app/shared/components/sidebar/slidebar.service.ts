import { BaseService } from './../../services/base.service';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: "root" })
export class SliderService{
    constructor(private baseService: BaseService) {}

    async getUserRoute(): Promise<any> {
        try {
            // console.log("userId",this.baseService.id);
            const data={
                "idUsuario":this.baseService.id
            }
          const response = await this.baseService.post(`usuario/proceso`,data).toPromise();
          // console.log("Respuesta del servidor:", response);
          return response;
        } catch (error) {
          // console.error("Error al enviar el firmante:", error);
          throw error;
        }
      }
}
