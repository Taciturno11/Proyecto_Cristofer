import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Role, RoleRequestDto, RoleResponse } from '../models/role.model';
import { API_ENDPOINTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly baseUrl = API_ENDPOINTS.BASE_URL;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los roles del sistema
   */
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.ROLES}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un rol específico por ID
   */
  getRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.ROLES}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crea un nuevo rol
   */
  createRole(roleData: RoleRequestDto): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.ROL_CREATE}`, roleData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza un rol existente
   */
  updateRole(id: string, roleData: RoleRequestDto): Observable<RoleResponse> {
    return this.http.put<RoleResponse>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.ROL_UPDATE}/${id}`, roleData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Elimina un rol
   */
  deleteRole(id: string): Observable<RoleResponse> {
    return this.http.delete<RoleResponse>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.ROL_DELETE}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Maneja los errores HTTP
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocurrió un error en el servidor';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 400) {
        errorMessage = error.error?.message || 'Datos inválidos';
      } else if (error.status === 404) {
        errorMessage = 'Rol no encontrado';
      } else if (error.status === 409) {
        errorMessage = error.error?.message || 'El rol ya existe';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('Error en RoleService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
