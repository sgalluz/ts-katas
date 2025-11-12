import { Product } from './models/Product'
import { UserProfile } from './models/UserProfile'
import { ILogger } from './services/Logger'
import { DiscountCalculator } from './services/DiscountCalculator'
import { ShippingCalculator } from './services/ShippingCalculator'
import { INotifier } from './services/Notifier'
import { ICartItemsLoader } from './services/CartItemsLoader'


// The God Class
export class CartManager {
  private items: { product: Product, quantity: number }[] = []
  private shippingAddress = ''
  private appliedCouponCode: string | null = null

  /**
     * Constructor with initialization logic that loads data
     * and has side effects (logging).
     */
  constructor(
        private readonly userProfile: UserProfile, // Still depends on an entire profile, just implementing DI via constructor
        private readonly cartItemsLoader: ICartItemsLoader,
        private readonly discountCalculator: DiscountCalculator,
        private readonly shippingCalculator: ShippingCalculator,
        private readonly notifier: INotifier,
        private readonly logger: ILogger
  ) {
    if (this.userProfile.savedCartItems.length > 0) {
      this.logger.log(`Loading ${this.userProfile.savedCartItems.length} saved items for user ${this.userProfile.id}`)
      this.items = this.cartItemsLoader.loadItems(this.userProfile.savedCartItems)
    }
    this.logger.log(`[LOGGING] Cart initialized for user: ${this.userProfile.id}.`)
  }

  /**
     * Huge method that does too many things (CRUD + Business Logic)
     */
  public updateCart(
    productId: number,
    quantity: number,
    couponCode: string | null = null,
    address = ''
  ): { success: boolean, message: string } {

    // 1. Cart Management (Responsibility 1)
    // Simulates product retrieval
    const product: Product = { id: productId, name: `Product ${productId}`, price: productId * 10, weightKg: 1 }
    const existingItem = this.items.find(item => item.product.id === productId)

    if (quantity <= 0) {
      if (existingItem) {
        this.items = this.items.filter(item => item.product.id !== productId)
      }
      return { success: true, message: 'Item removed or zero quantity ignored.' }
    }

    if (existingItem) {
      existingItem.quantity = quantity
    } else {
      this.items.push({ product, quantity })
    }

    // 2. Lifestyle Updates (Implicit side effects)
    this.appliedCouponCode = couponCode
    this.shippingAddress = address

    // 3. Logic Control (Responsibility 2: Validation)
    if (this.userProfile.id === 999 && product.price > 100) { // Uses this.userProfile.id
      return { success: false, message: 'VIP user 999 cannot purchase expensive items directly.' }
    }

    return { success: true, message: 'Cart updated successfully.' }
  }

  /**
     * Huge method that calculates everything (Responsibilities 3, 4, 5, 7, 8)
     */
  public getFinalSummary(): { total: number, discount: number, shippingCost: number, finalTotal: number } {
    const subtotal = this.getSubtotal()

    const discount = this.discountCalculator.calculateDiscount(subtotal, this.userProfile, this.appliedCouponCode)

    const totalAfterDiscount = subtotal - discount

    const shippingCost = this.shippingCalculator.calculateShipping(
      totalAfterDiscount,
      this.getTotalWeight(),
      this.shippingAddress,
      this.userProfile,
      this.appliedCouponCode
    )

    const finalTotal = totalAfterDiscount + shippingCost

    if (finalTotal > 500 && this.items.length > 5) {
      this.notifier.sendHighValueOrderAlert(this.userProfile.id, finalTotal)
    }

    return {
      total: subtotal,
      discount: discount,
      shippingCost: shippingCost,
      finalTotal: finalTotal
    }
  }

  private getTotalWeight(): number {
    return this.items.reduce(
      (acc, { product, quantity }) => acc + product.weightKg * quantity,
      0
    )
  }

  private getSubtotal(): number {
    return this.items.reduce(
      (acc, { product, quantity }) => acc + product.price * quantity,
      0
    )
  }
}