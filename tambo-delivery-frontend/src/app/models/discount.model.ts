import { Product } from "./product.model";

export interface Discount {
  id: string;
  name: string;
  percentage: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  products?: Product[];
}