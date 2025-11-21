import { ICartValidator } from './CartValidator'
import { INotifier } from './Notifier'
import { ILogger } from './Logger'
import { ProductRepository } from '../repositories/ProductRepository'
import { UserProfile } from '../models/UserProfile'
import { CartManager } from '../CartManager'
import { Cart } from '../models/Cart'
import { ICartSummaryService } from './CartSummaryService'

export class CartFactory {
  constructor(
        private readonly productRepository: ProductRepository,
        private readonly cartSummaryService: ICartSummaryService,
        private readonly cartValidator: ICartValidator,
        private readonly notifier: INotifier,
        private readonly logger: ILogger
  ) {
  }

  public createCartForUser(userProfile: UserProfile): CartManager {
    const { savedCartItems, id } = userProfile
    if (savedCartItems.length) this.logger.log(`Loading ${savedCartItems.length} saved items for user ${id}`)

    const cart = this.buildCartFromSavedItems(savedCartItems)

    return new CartManager(
      userProfile,
      cart,
      this.productRepository,
      this.cartSummaryService,
      this.cartValidator,
      this.notifier,
      this.logger
    )
  }

  private buildCartFromSavedItems(savedItems: UserProfile['savedCartItems']): Cart {
    const items: Cart['items'] = savedItems.flatMap(item => this.toCartItem(item))
    return new Cart(items)
  }

  private toCartItem({ productId, quantity }: UserProfile['savedCartItems'][number]): Cart['items'] {
    const product = this.productRepository.getProductById(productId)
    if (product) return [{ product, quantity }]

    this.logger.warn(`Saved product ${productId} not found. Ignoring...`)
    return []
  }
}