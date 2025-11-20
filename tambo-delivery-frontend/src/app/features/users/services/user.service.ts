import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../constants/app.constants';
import { User } from '../../../models/user.model';

// DTOs para el backend Spring Boot
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  enabled: boolean;
}

export interface UpdateUserRequest extends CreateUserRequest {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  // ============================== ADMIN - USUARIOS ==============================

  /**
   * Obtener todos los usuarios
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.USERS}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear usuario (admin)
   */
  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.USERS}`,
      userData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar usuario (admin)
   */
  updateUser(userId: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.USERS}/${userId}`,
      userData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar usuario (admin)
   */
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.USERS}/${userId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ============================== MANEJO DE ERRORES ==============================

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';
    
    console.error('❌ [UserService] Error completo:', error);
    console.error('❌ [UserService] Error status:', error.status);
    console.error('❌ [UserService] Error statusText:', error.statusText);
    console.error('❌ [UserService] Error url:', error.url);

    if (error.status === 401) {
      errorMessage = 'Error de autorización - El endpoint requiere autenticación';
      console.error('🔒 [UserService] Error 401: Endpoint protegido o problema de CORS/Seguridad');
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor - Posible problema de CORS';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor';
    }

    console.error('❌ [UserService] Error Message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}