export interface Sale {
  id: number;
  totalAmount: number;
  date: Date;
  name: string;
}

export interface SaleItem {
  id: number;
  saleId: number;
  dishName: string;
  quantity: number;
  price: number;
  subtotal?: number;
  dishId: number;
}
