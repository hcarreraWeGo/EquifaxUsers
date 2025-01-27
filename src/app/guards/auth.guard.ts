import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica si el usuario está autenticado
  if (!authService.isAuthenticated()) {
    // Si no está autenticado, redirige al login
    router.navigate(['/auth/login']);
    return false;  // Bloquea el acceso a la ruta
  }

  return true;
};
