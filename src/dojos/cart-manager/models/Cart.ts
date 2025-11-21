import { Product } from './Product'

interface CartItem {
    product: Product,
    quantity: number
}

export class Cart {
  constructor(private items: CartItem[] = []) {
  }

  findBy(productId: number): CartItem | undefined {
    return this.items.find(item => item.product.id === productId)
  }

  add(product: Product, quantity: number): void {
    this.items.push({ product, quantity })
  }

  remove(productId: number): void {
    this.items = this.items.filter(item => item.product.id !== productId)
  }

  setQuantity(product: Product, quantity: number): void {
    if (quantity <= 0) {
      this.remove(product.id)
      return
    }

    const existingItem = this.findBy(product.id)
    if (existingItem) {
      existingItem.quantity = quantity
    } else {
      this.add(product, quantity)
    }
  }

  get length(): number {
    return this.items.length
  }

  get totalPrice(): number {
    return this.items.reduce(
      (total, { product, quantity }) => total + product.price * quantity,
      0
    )
  }

  get totalWeight(): number {
    return this.items.reduce(
      (total, { product, quantity }) => total + product.weightKg * quantity,
      0
    )
  }
}
