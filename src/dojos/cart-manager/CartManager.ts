import { ShippingService } from './services/ShippingService'
import { DiscountService } from './services/DiscountService'
import { buildProduct, Product } from './models/Product'
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
      const product: Product = buildProduct(item.productId)
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

  public getItems(): { product: Product, quantity: number }[] {
    return this.items
  }

  public getShippingAddress(): string {
    return this.shippingAddress
  }

  public getAppliedCouponCode(): string | null {
    return this.appliedCouponCode
  }

  public getUserProfile(): UserProfile {
    return this.userProfile
  }

  public updateCart(
    productId: number,
    quantity: number,
    couponCode: string | null = null,
    address = ''
  ): { success: boolean, message: string } {

    const product: Product = buildProduct(productId)

    const validationResult = this.validateCartUpdate(product)
    if (!validationResult.isValid) {
      return { success: false, message: validationResult.message }
    }

    this.updateCartItems(productId, product, quantity)
    this.updateCartCoupon(couponCode)
    this.updateCartAddress(address)

    return { success: true, message: 'Cart updated successfully.' }
  }

  private validateCartUpdate(product: Product): { isValid: boolean, message: string } {
    if (this.userProfile.id === 999 && product.price > 100) {
      return {
        isValid: false,
        message: 'VIP user 999 cannot purchase expensive items directly.'
      }
    }
    return { isValid: true, message: '' }
  }

  private updateCartItems(productId: number, product: Product, quantity: number): void {
    if (quantity <= 0) {
      this.removeCartItem(productId)
      return
    }

    const existingItem = this.items.find(item => item.product.id === productId)
    if (existingItem) {
      existingItem.quantity = quantity
    } else {
      this.items.push({ product, quantity })
    }
  }

  private removeCartItem(productId: number): void {
    this.items = this.items.filter(item => item.product.id !== productId)
  }

  private updateCartCoupon(couponCode: string | null): void {
    this.appliedCouponCode = couponCode
  }

  private updateCartAddress(address: string): void {
    this.shippingAddress = address
  }


  public updateCartItem(
    productId: number,
    quantity: number,
  ): { success: boolean, message: string } {

    const existingItem = this.items.find(item => item.product.id === productId)

    if (existingItem) {
      existingItem.quantity = quantity
    } else {
      const product: Product = buildProduct(productId)
      this.items.push({ product, quantity })
    }

    return { success: true, message: 'Cart item updated successfully.' }
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