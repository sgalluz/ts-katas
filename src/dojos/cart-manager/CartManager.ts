import { ShippingService } from './services/ShippingService'
import { DiscountService } from './services/DiscountService'
import { Product } from './models/Product'
import { UserProfile, UserType } from './models/UserProfile'


// The God Class
export class CartManager {
  private items: { product: Product, quantity: number }[] = []
  private shippingAddress = ''
  private appliedCouponCode: string | null = null
  private userProfile: UserProfile // Now depends on an entire profile

  /**
     * Constructor with initialization logic that loads data
     * and has side effects (logging).
     */
  constructor(userProfile: UserProfile) {
    this.userProfile = userProfile

    // Responsibility 6: Initial State Loading
    if (userProfile.savedCartItems.length > 0) {
      console.log(`Loading ${userProfile.savedCartItems.length} saved items for user ${userProfile.id}`)
      // Simulation of complex merge logic with current in-memory products
      this.loadInitialCart(userProfile.savedCartItems)
    }

    // Side effect/Implicit initialization that makes instantiation difficult
    this.logCartInitialization(userProfile.id)
  }

  /**
     * Private helper method that complicates constructor testing.
     * Simulates data retrieval and validation.
     */
  private loadInitialCart(savedItems: { productId: number, quantity: number }[]) {
    savedItems.forEach(item => {
      // Simulates product retrieval from DB (another hidden dependency!)
      const product: Product = {
        id: item.productId,
        name: `Product ${item.productId}`,
        price: item.productId * 10,
        weightKg: 1
      }
      this.items.push({ product, quantity: item.quantity })
    })
  }

  /**
     * Side effect in the constructor.
     */
  private logCartInitialization(userId: number): void {
    // Simulates writing to an external log file
    console.log(`[LOGGING] Cart initialized for user: ${userId}.`)
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

    const subtotal = this.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    const totalWeight = this.items.reduce((acc, item) => acc + item.product.weightKg * item.quantity, 0)
    let discount = 0
    let shippingCost = 0

    // Discount Calculation: has a strict dependency with UserProfile type (Responsibility 3)
    if (this.appliedCouponCode) {
      const discountValue = DiscountService.validateCoupon(
        this.appliedCouponCode,
        subtotal,
        this.userProfile.type
      )

      if (discountValue !== null) {
        discount = discountValue
      }
    }

    // Addition: First Purchase Discount (Responsibility 7)
    if (this.userProfile.isFirstPurchase && this.userProfile.type === UserType.Standard) {
      discount += subtotal * 0.10 // BUG: Adds up with coupon
    }

    const totalAfterDiscount = subtotal - discount

    // 4. Shipping Calculation (Responsibility 4)
    if (totalAfterDiscount < 50 && this.shippingAddress) {
      shippingCost = ShippingService.calculate(this.shippingAddress, totalWeight)
    } else if (this.appliedCouponCode === 'FREE_SHIPPING' || totalAfterDiscount >= 100) {
      shippingCost = 0
    } else {
      shippingCost = 15 // Base cost
    }

    // Addition: Financial validation logic (Responsibility 8)
    if (this.userProfile.type === UserType.Guest && subtotal > 200) {
      console.warn('Guest transaction exceeds limit. Applying extra fee.')
      shippingCost += 10
    }

    const finalTotal = totalAfterDiscount + shippingCost

    // 5. Notification/side effect (Responsibility 5)
    if (finalTotal > 500 && this.items.length > 5) {
      this.sendHighValueOrderAlert(finalTotal)
    }

    return {
      total: subtotal,
      discount: discount,
      shippingCost: shippingCost,
      finalTotal: finalTotal
    }
  }

  /**
     * Another private side effect.
     */
  private sendHighValueOrderAlert(amount: number): void {
    console.log(`*** NOTIFICATION ***: User ${this.userProfile.id} has a high-value cart: ${amount}`)
    // Send an email to the administrator...
  }
}