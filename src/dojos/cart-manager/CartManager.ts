import { UserProfile } from './models/UserProfile'
import { ILogger } from './services/Logger'
import { IDiscountCalculator } from './services/DiscountCalculator'
import { IShippingCalculator } from './services/ShippingCalculator'
import { INotifier } from './services/Notifier'
import { CartItem } from './models/CartItem'
import { ProductRepository } from './repositories/ProductRepository'


// The God Class
export class CartManager {
  private shippingAddress = ''
  private appliedCouponCode: string | null = null

  constructor(
        private readonly userProfile: UserProfile, // Still depends on an entire profile, just implementing DI via constructor
        private items: CartItem[],
        private readonly productRepository: ProductRepository,
        private readonly discountCalculator: IDiscountCalculator,
        private readonly shippingCalculator: IShippingCalculator,
        private readonly notifier: INotifier,
        private readonly logger: ILogger
  ) {
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
    const product = this.productRepository.getProductById(productId)

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
    const { totalPrice: subtotal, totalWeight } = this.getTotalPriceAndWeight()

    const discount = this.discountCalculator.calculateDiscount(subtotal, this.userProfile, this.appliedCouponCode)

    const totalAfterDiscount = subtotal - discount

    const shippingCost = this.shippingCalculator.calculateShipping(
      totalAfterDiscount,
      totalWeight,
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

  private getTotalPriceAndWeight(): { totalPrice: number, totalWeight: number } {
    return this.items.reduce(
      (acc, { product, quantity }) => {
        acc.totalPrice += product.price * quantity
        acc.totalWeight += product.weightKg * quantity
        return acc
      },
      { totalPrice: 0, totalWeight: 0 }
    )
  }
}