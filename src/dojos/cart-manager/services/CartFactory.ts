import { IDiscountCalculator } from './DiscountCalculator'
import { IShippingCalculator } from './ShippingCalculator'
import { INotifier } from './Notifier'
import { ILogger } from './Logger'
import { ProductRepository } from '../repositories/ProductRepository'
import { UserProfile } from '../models/UserProfile'
import { CartManager } from '../CartManager'
import { CartItem } from '../models/CartItem'
import { CartItems } from '../models/CartItems'

export class CartFactory {
  constructor(
        private readonly productRepository: ProductRepository,
        private readonly discountCalculator: IDiscountCalculator,
        private readonly shippingCalculator: IShippingCalculator,
        private readonly notifier: INotifier,
        private readonly logger: ILogger
  ) {
  }

  public createCartForUser(userProfile: UserProfile): CartManager {
    const { savedCartItems, id } = userProfile
    if (savedCartItems.length) this.logger.log(`Loading ${savedCartItems.length} saved items for user ${id}`)

    const initialItems: CartItem[] =
            savedCartItems.flatMap(({ productId, quantity }) => {
              const product = this.productRepository.getProductById(productId)
              if (product) return [{ product, quantity }]

              this.logger.warn(`Saved product ${productId} not found. Ignoring...`)
              return []
            })

    return new CartManager(
      userProfile,
      new CartItems(initialItems),
      this.productRepository,
      this.discountCalculator,
      this.shippingCalculator,
      this.notifier,
      this.logger
    )
  }
}