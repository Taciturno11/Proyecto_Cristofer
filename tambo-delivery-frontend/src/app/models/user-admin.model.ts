export interface UserDetailsDto {
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  email: string;
  authorityList: string[];
  enabled: boolean;
}

export interface UserRequestDtoAdmin {
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  email: string;
  roles: string[];
}

export interface UserAdminResponse {
  message: string;
}

// Interfaz para la tabla de usuarios en el frontend
export interface UserTableData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roles: string;
  profileImageUrl?: string;
  enabled: boolean;
}

// Opciones para los roles disponibles
export interface RoleOption {
  value: string;
  label: string;
}

export const AVAILABLE_ROLES: RoleOption[] = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'USER', label: 'Usuario' }
];