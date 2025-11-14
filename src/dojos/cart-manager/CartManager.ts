import { UserProfile } from './models/UserProfile'
import { ILogger } from './services/Logger'
import { INotifier } from './services/Notifier'
import { ICartValidator } from './services/CartValidator'
import { CartItems } from './models/CartItems'
import { ProductRepository } from './repositories/ProductRepository'
import { CartSummary } from './models/CartSummary'
import { CheckoutOptions } from './models/CheckoutOptions'
import { ICartSummaryService } from './services/CartSummaryService'

export class CartManager {
  constructor(
        private readonly userProfile: UserProfile,
        private readonly cartItems: CartItems,
        private readonly productRepository: ProductRepository,
        private readonly cartSummaryService: ICartSummaryService,
        private readonly cartValidator: ICartValidator,
        private readonly notifier: INotifier,
        private readonly logger: ILogger
  ) {
    this.logger.log(`[LOGGING] Cart initialized for user: ${this.userProfile.id}.`)
  }

  public updateCart(productId: number, quantity: number): { success: boolean, message: string } {
    const product = this.productRepository.getProductById(productId)

    const { valid, reason } = this.cartValidator.canAddProduct(this.userProfile, product)
    if (!valid) return { success: false, message: reason ?? 'Cannot add product' }

    this.cartItems.setQuantity(product, quantity)

    const message = quantity <= 0 ? 'Item removed or zero quantity ignored.' : 'Cart updated successfully.'

    return { success: true, message }
  }

  public getFinalSummary(checkoutOptions: CheckoutOptions = {}): CartSummary {
    const summary = this.cartSummaryService.generateSummary(
      this.cartItems,
      this.userProfile,
      checkoutOptions
    )

    if (this.cartValidator.isHighValueOrder(summary.finalTotal, this.cartItems.length)) {
      this.notifier.sendHighValueOrderAlert(this.userProfile.id, summary.finalTotal)
    }

    return summary
  }
}