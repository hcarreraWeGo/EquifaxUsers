import { BaseService } from './../../shared/services/base.service';

import { Injectable } from '@angular/core';



@Injectable({ providedIn: "root" })
export class DashboardService {
  constructor(private baseService: BaseService) { }

  async addNumTramite(cedula, numTramite): Promise<any> {
    try {
      const data = {
        "cedula": cedula,
        "numTramite": numTramite
      }
      return await this.baseService.post(`cedula-tramite`, data).toPromise();
      
    } catch (error) {
      console.error("Error al enviar el firmante:", error);
      throw error;
    }
  }

  async addCliente(nombre, apellido, cedula, numTramite, email, idProceso): Promise<any> {
    try {
      const data = {
        "clienteData": {
          "nombre": nombre,
          "apellido": apellido,
          "cedula": cedula,
          "correo": email,
          "numTramite": numTramite,
        }
        ,
        "solicitudData": {
          "idProceso": idProceso,
          "idUsuario": this.baseService.id

        }
      }
      
      return await this.baseService.post(`add-cliente`, data).toPromise();
    } catch (error) {
      console.error("Error al enviar el firmante:", error);
      throw error;
    }
  }

  async getClienteByUsuario(idProceso): Promise<any> {
    return await this.baseService
    // es opcional el idProceso para este endpoint
      .get(`clientes/${this.baseService.id}?idProceso=${idProceso}`)
      .toPromise();
  }

  async getIdPaquete(data): Promise<any> {
    try {
      return await this.baseService.post(`obtener-id-paquete`, data).toPromise();
    } catch (error) {
      console.error("Error consultar el firmante:", error);
      throw error;
    }
  }

  async GenerarTexto(data):Promise<any>{
    try {
      return await this.baseService.post(`empresas/generar-texto/${this.baseService.idEmpresa}`, data).toPromise();
    } catch (error) {
      console.error("Error al enviar el firmante:", error);
      throw error;
    }
  }

  async obtenerPdf(data):Promise<any>{
    try {
      return await this.baseService.postExterno(`generar_pdf`, data).toPromise();
    } catch (error) {
      console.error("Error al enviar el firmante:", error);
      throw error;
    }
  }

  async updateClienteNumeroTramite(data):Promise<any>{
    try {
      return await this.baseService.put(`clientes/update-num-tramite`,data).toPromise();
    } catch (error) {
      console.error("Error al enviar el firmante:", error);
      throw error;
    }
  }

}