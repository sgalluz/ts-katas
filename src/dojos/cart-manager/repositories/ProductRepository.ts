import { Product } from '../models/Product'

export interface ProductRepository {
    getProductById(productId: number): Product
}

export class InMemoryProductRepository implements ProductRepository {
  getProductById(productId: number): Product {
    // Simulates product retrieval from DB
    return {
      id: productId,
      name: `Product ${productId}`,
      price: productId * 10,
      weightKg: 1
    }
  }
}
