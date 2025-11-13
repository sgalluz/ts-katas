import { IDiscountCalculator } from './DiscountCalculator'
import { IShippingCalculator } from './ShippingCalculator'
import { INotifier } from './Notifier'
import { ILogger } from './Logger'
import { ProductRepository } from './ProductRepository'
import { UserProfile } from '../models/UserProfile'
import { CartManager } from '../CartManager'
import { CartItem } from '../models/CartItem'
import { CartItemsLoader } from './CartItemsLoader'

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
    const initialItems: CartItem[] =
            userProfile.savedCartItems.flatMap(({ productId, quantity }) => {
              const product = this.productRepository.getProductById(productId)
              if (product) return [{ product, quantity }]

              this.logger.warn(`Saved product ${productId} not found. Ignoring...`)
              return []
            })

    return new CartManager(
      userProfile,
      new CartItemsLoader(this.productRepository), // CartItemsLoader is bing replaced by pre-loaded items
      initialItems, // CartItemsLoader is bing replaced by pre-loaded items
      this.discountCalculator,
      this.shippingCalculator,
      this.notifier,
      this.logger
    )
  }
}