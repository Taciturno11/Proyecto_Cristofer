import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { API_ENDPOINTS, APP_CONSTANTS } from '../../constants/app.constants';

// DTOs basados en el backend Spring Boot
export interface LoginRequest {
  userName: string; // El backend usa userName en lugar de email
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  token: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface UserResponseDto {
  code: number;
  message: string;
  user?: User;
}

export interface VerifyRequest {
  userName: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// DTO que devuelve el backend para el perfil del usuario
interface UserDetailsDto {
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  email: string;
  authorityList: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user from localStorage on service initialization
    this.loadUserFromStorage();

    // Si hay un token válido, intentar cargar el perfil del usuario
    if (this.token && !this.currentUser) {
      this.loadCurrentUser().subscribe({
        next: (user) => {},
        error: (error) => {
          this.clearAuthData();
        },
      });
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
        credentials
      )
      .pipe(
        tap((response) => {
          if (response.code === 200 && response.token) {
            this.setAuthToken(response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Método separado para cargar el perfil después del login exitoso
   */
  loginAndLoadProfile(
    credentials: LoginRequest
  ): Observable<{ success: boolean; redirectRoute?: string; error?: string }> {
    return this.login(credentials).pipe(
      switchMap((loginResponse) => {
        if (loginResponse.code === 200) {
          // Agregar un pequeño delay para asegurar que el interceptor tenga el token
          return new Promise((resolve) => setTimeout(resolve, 200))
            .then(() => {
              return this.loadCurrentUser().toPromise();
            })
            .then((user) => {
              const redirectRoute = this.getRedirectRouteForUser();
              return { success: true, redirectRoute };
            })
            .catch((error) => {
              console.error(
                '🔐 AuthService: Error loading profile, but login was successful:',
                error
              );
              return { success: true, redirectRoute: '/home' };
            });
        } else {
          return of({ success: false, error: loginResponse.message });
        }
      }),
      catchError((error) => {
        console.error('🔐 AuthService: Login failed:', error);
        return of({ success: false, error: error.message });
      })
    );
  }

  register(userData: RegisterRequest): Observable<UserResponseDto> {
    return this.http
      .post<UserResponseDto>(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
        userData
      )
      .pipe(
        tap((response) => {
          if (response.code === 200) {
            // Note: El registro exitoso no necesariamente incluye un token o login automático
            // Depende de la lógica de tu backend
          }
        }),
        catchError(this.handleError)
      );
  }

  verifyAccount(verifyData: VerifyRequest): Observable<any> {
    return this.http
      .post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.VERIFY}`, verifyData)
      .pipe(catchError(this.handleError));
  }

  forgotPassword(email: string): Observable<any> {
    return this.http
      .post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
        email,
      })
      .pipe(catchError(this.handleError));
  }

  resetPassword(resetData: ResetPasswordRequest): Observable<any> {
    return this.http
      .post(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`,
        resetData
      )
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    this.clearAuthData();
  }

  // Obtener el usuario actual desde el backend
  loadCurrentUser(): Observable<User> {
    return this.http
      .get<UserDetailsDto>(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.USERS.PROFILE}`
      )
      .pipe(
        map((userDto) => {
          // Convertir UserDetailsDto a User
          const user: User = {
            id: '', // El backend no devuelve el ID en este endpoint
            email: userDto.email,
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            phoneNumber: userDto.phoneNumber,
            profileImageUrl: userDto.profileImageUrl,
            enabled: true, // Asumimos que está habilitado si puede hacer login
            authorities: userDto.authorityList.map((auth) => ({
              id: '',
              authority: auth,
            })),
          };
          return user;
        }),
        tap((user) => {
          this.setCurrentUser(user);
        }),
        catchError(this.handleError)
      );
  }

  // Métodos auxiliares
  private setAuthToken(token: string): void {
    localStorage.setItem(APP_CONSTANTS.TOKEN_KEY, token);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(APP_CONSTANTS.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private clearAuthData(): void {
    localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(APP_CONSTANTS.USER_KEY);
    this.currentUserSubject.next(null);
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
    const userStr = localStorage.getItem(APP_CONSTANTS.USER_KEY);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

  // Getters públicos
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser && !this.isTokenExpired();
  }

  /**
   * Verifica si el token JWT está expirado
   */
  isTokenExpired(): boolean {
    const token = this.token;
    if (!token) return true;

    try {
      // Decodificar el JWT (separar el payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;

      if (!exp) return true;

      // Verificar si ya expiró (exp está en segundos, Date.now() en milisegundos)
      const isExpired = Date.now() >= exp * 1000;

      if (isExpired) {
        console.warn('🔑 Token expirado.');
      }

      return isExpired;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true;
    }
  }

  get isAdmin(): boolean {
    const authorities = this.currentUser?.authorities || [];
    const isAdmin = authorities.some((auth) => auth.authority === 'ADMIN');
    return isAdmin;
  }

  /**
   * Obtiene la ruta de redirección apropiada basada en el rol del usuario
   */
  getRedirectRouteForUser(): string {
    if (this.isAdmin) {
      return '/admin/dashboard';
    } else {
      return '/home';
    }
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('Auth Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
