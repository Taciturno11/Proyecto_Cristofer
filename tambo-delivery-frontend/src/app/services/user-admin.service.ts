import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  UserDetailsDto, 
  UserRequestDtoAdmin, 
  UserAdminResponse, 
  UserTableData 
} from '../models/user-admin.model';
import { API_ENDPOINTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {

  private readonly baseUrl = API_ENDPOINTS.BASE_URL;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los usuarios del sistema
   */
  getAllUsers(): Observable<UserDetailsDto[]> {
    return this.http.get<UserDetailsDto[]>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.USERS}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un usuario específico por email
   */
  getUserByEmail(email: string): Observable<UserDetailsDto> {
    return this.http.get<UserDetailsDto>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.USERS_BY_EMAIL}/${email}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crea un nuevo usuario
   */
  createUser(userData: UserRequestDtoAdmin): Observable<UserAdminResponse> {
    return this.http.post<UserAdminResponse>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.USERS_CREATE}`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza un usuario existente
   */
  updateUser(email: string, userData: UserRequestDtoAdmin): Observable<UserAdminResponse> {
    const url = `${this.baseUrl}${API_ENDPOINTS.ADMIN.USERS_UPDATE}/${email}`;
    
    return this.http.put<UserAdminResponse>(url, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Desactiva un usuario (soft delete)
   */
  deleteUser(email: string): Observable<UserAdminResponse> {
    const url = `${this.baseUrl}${API_ENDPOINTS.ADMIN.USERS_DELETE}/${email}`;
    
    return this.http.delete<UserAdminResponse>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Activa un usuario previamente desactivado
   */
  activateUser(email: string): Observable<UserAdminResponse> {
    const url = `${this.baseUrl}${API_ENDPOINTS.ADMIN.USERS_ACTIVATE}/${email}`;
    
    return this.http.put<UserAdminResponse>(url, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Alterna el estado de un usuario (activar/desactivar)
   */
  toggleUserStatus(email: string): Observable<UserAdminResponse> {
    const url = `${this.baseUrl}${API_ENDPOINTS.ADMIN.USERS_TOGGLE_STATUS}/${email}`;
    
    return this.http.put<UserAdminResponse>(url, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Convierte UserDetailsDto a UserTableData para mostrar en tabla
   */
  mapToTableData(users: UserDetailsDto[]): UserTableData[] {
    return users.map(user => {
      const roles = user.authorityList && user.authorityList.length > 0 
        ? user.authorityList.join(', ') 
        : 'Sin roles asignados';
      
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        roles: roles,
        profileImageUrl: user.profileImageUrl,
        enabled: user.enabled
      };
    });
  }

  /**
   * Convierte UserDetailsDto a UserRequestDtoAdmin para edición
   */
  mapToUserRequest(user: UserDetailsDto): UserRequestDtoAdmin {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl,
      roles: user.authorityList
    };
  }

  /**
   * Manejo de errores
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error desconocido';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    }

    console.error('Error en UserAdminService:', error);
    return throwError(() => new Error(errorMessage));
  }
}