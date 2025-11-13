import { CartItem } from './CartItem'
import { Product } from './Product'

export class CartItems {
  constructor(private items: CartItem[] = []) {
  }

  findByProductId(productId: number): CartItem | undefined {
    return this.items.find(item => item.product.id === productId)
  }

  remove(productId: number): void {
    this.items = this.items.filter(item => item.product.id !== productId)
  }

  updateQuantity(productId: number, quantity: number): void {
    const existingItem = this.findByProductId(productId)
    if (existingItem) existingItem.quantity = quantity
  }

  add(product: Product, quantity: number): void {
    this.items.push({ product, quantity })
  }

  getAll(): CartItem[] {
    return this.items
  }

  get length(): number {
    return this.items.length
  }

  getTotalPrice(): number {
    return this.items.reduce(
      (total, { product, quantity }) => total + product.price * quantity,
      0
    )
  }

  getTotalWeight(): number {
    return this.items.reduce(
      (total, { product, quantity }) => total + product.weightKg * quantity,
      0
    )
  }
}
