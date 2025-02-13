import { AuthRoutingModule } from './auth-routing-module';
import { SharedModule } from './../shared/shared.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      LoginComponent,
      
    ],
    imports: [
      CommonModule,
      SharedModule,
      AuthRoutingModule,
      
    ],
    exports: [],
  })
  export class AuthModule {
    constructor() {
      console.log("AuthModule Cargado");  // ✅ Para verificar si el módulo se está cargando
    }
  }