import { Product } from '../models/Product'
import { ProductRepository } from './ProductRepository'

export interface ICartItemsLoader {
    loadItems(savedItems: { productId: number, quantity: number }[]): { product: Product, quantity: number }[]
}

export class CartItemsLoader implements ICartItemsLoader {
  constructor(private readonly productRepository: ProductRepository) {
  }

  loadItems(savedItems: { productId: number, quantity: number }[]): { product: Product, quantity: number }[] {
    return savedItems.map(item => ({
      product: this.productRepository.getProductById(item.productId),
      quantity: item.quantity
    }))
  }
}