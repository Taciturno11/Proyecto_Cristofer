export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  categoryTypes?: CategoryType[]; // Cambiado para coincidir con backend
}

export interface CategoryType {
  id: string;
  name: string;
  description?: string;
  categoryId?: string; // Agregado para crear tipos asociados
}