import { IDiscountCalculator } from './DiscountCalculator'
import { IShippingCalculator } from './ShippingCalculator'
import { CartSummary } from '../models/CartSummary'
import { UserProfile } from '../models/UserProfile'
import { Cart } from '../models/Cart'
import { CheckoutOptions } from '../models/CheckoutOptions'

export interface ICartSummaryService {
    generateSummary(cart: Cart, userProfile: UserProfile, checkoutOptions: CheckoutOptions): CartSummary
}

export class CartSummaryService implements ICartSummaryService {
  constructor(
        private readonly discountCalculator: IDiscountCalculator,
        private readonly shippingCalculator: IShippingCalculator
  ) {
  }

  public generateSummary(
    cart: Cart,
    userProfile: UserProfile,
    { couponCode = null, shippingAddress = '' }: CheckoutOptions = {}
  ): CartSummary {
    const total = cart.totalPrice

    const discount = this.discountCalculator.calculateDiscount(total, userProfile, couponCode)

    const totalAfterDiscount = total - discount

    const shippingCost = this.shippingCalculator.calculateShipping({
      totalPrice: totalAfterDiscount,
      totalWeight: cart.totalWeight,
      userProfile: userProfile,
      checkoutOptions: { shippingAddress, couponCode }
    })

    const finalTotal = totalAfterDiscount + shippingCost

    return { total, discount, shippingCost, finalTotal }
  }
}