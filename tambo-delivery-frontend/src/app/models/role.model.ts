export interface Role {
  id: string;
  roleCode: string;
  roleDescription: string;
}

export interface RoleRequestDto {
  roleCode: string;
  roleDescription: string;
}

export interface RoleResponse {
  message: string;
}
