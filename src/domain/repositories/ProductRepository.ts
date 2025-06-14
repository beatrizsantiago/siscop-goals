import Product from '@domain/entities/Product';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
};
