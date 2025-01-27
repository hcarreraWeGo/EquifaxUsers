// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    // Aquí puedes verificar si existe un token en el localStorage o sessionStorage
    return !!localStorage.getItem('token');
  }

  // Otros métodos de autenticación como login, logout, etc.
}
