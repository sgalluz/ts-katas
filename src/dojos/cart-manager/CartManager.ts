import { UserProfile } from './models/UserProfile'
import { ILogger } from './services/Logger'
import { IDiscountCalculator } from './services/DiscountCalculator'
import { IShippingCalculator } from './services/ShippingCalculator'
import { INotifier } from './services/Notifier'
import { ICartValidator } from './services/CartValidator'
import { CartItems } from './models/CartItems'
import { ProductRepository } from './repositories/ProductRepository'


// The God Class
export class CartManager {
  private shippingAddress = ''
  private appliedCouponCode: string | null = null

  constructor(
        private readonly userProfile: UserProfile, // Still depends on an entire profile, just implementing DI via constructor
        private readonly cartItems: CartItems,
        private readonly productRepository: ProductRepository,
        private readonly discountCalculator: IDiscountCalculator,
        private readonly shippingCalculator: IShippingCalculator,
        private readonly cartValidator: ICartValidator,
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

    const { valid, reason } = this.cartValidator.canAddProduct(this.userProfile, product)
    if (!valid) return { success: false, message: reason ?? 'Cannot add product' }

    this.cartItems.setQuantity(product, quantity)

    // 2. Lifestyle Updates (Implicit side effects)
    this.appliedCouponCode = couponCode
    this.shippingAddress = address

    const message = quantity <= 0 ? 'Item removed or zero quantity ignored.' : 'Cart updated successfully.'

    return { success: true, message }
  }

  /**
     * Huge method that calculates everything (Responsibilities 3, 4, 5, 7, 8)
     */
  public getFinalSummary(): { total: number, discount: number, shippingCost: number, finalTotal: number } {
    const subtotal = this.cartItems.totalPrice

    const discount = this.discountCalculator.calculateDiscount(subtotal, this.userProfile, this.appliedCouponCode)

    const totalAfterDiscount = subtotal - discount

    const shippingCost = this.shippingCalculator.calculateShipping(
      totalAfterDiscount,
      this.cartItems.totalWeight,
      this.shippingAddress,
      this.userProfile,
      this.appliedCouponCode
    )

    const finalTotal = totalAfterDiscount + shippingCost

    if (this.cartValidator.isHighValueOrder(finalTotal, this.cartItems.length)) {
      this.notifier.sendHighValueOrderAlert(this.userProfile.id, finalTotal)
    }

    return {
      total: subtotal,
      discount: discount,
      shippingCost: shippingCost,
      finalTotal: finalTotal
    }
  }
}