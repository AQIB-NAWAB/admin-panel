export interface User {
  id?: string;
  name: string;
  email: string;
}



export interface Product {
  id: string;
  name: string;
  image: string;
  description?: string;
  price: number;
  stock: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}