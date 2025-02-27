import { Injectable } from "@angular/core";
import { BaseService } from "../../shared/services/base.service";


@Injectable({ providedIn: "root" })
export class LoginService {
  constructor(
    public baseService: BaseService,
   
  ) {
  }

  
  async login(playload): Promise<any> {
    return await this.baseService.login(playload);
  }
}