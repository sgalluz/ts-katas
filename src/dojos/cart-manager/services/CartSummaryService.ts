import { IDiscountCalculator } from './DiscountCalculator'
import { IShippingCalculator } from './ShippingCalculator'
import { CartSummary } from '../models/CartSummary'
import { UserProfile } from '../models/UserProfile'
import { CartItems } from '../models/CartItems'
import { CheckoutOptions } from '../models/CheckoutOptions'

export interface ICartSummaryService {
  generateSummary(
    cartItems: CartItems,
    userProfile: UserProfile,
    checkoutOptions: CheckoutOptions
  ): CartSummary
}

export class CartSummaryService implements ICartSummaryService {
  constructor(
    private readonly discountCalculator: IDiscountCalculator,
    private readonly shippingCalculator: IShippingCalculator
  ) {}

  public generateSummary(
    cartItems: CartItems,
    userProfile: UserProfile,
    { couponCode = null, shippingAddress = '' }: CheckoutOptions = {}
  ): CartSummary {
    const total = cartItems.totalPrice

    const discount = this.discountCalculator.calculateDiscount(total, userProfile, couponCode)

    const totalAfterDiscount = total - discount

    const shippingCost = this.shippingCalculator.calculateShipping({
      totalPrice: totalAfterDiscount,
      totalWeight: cartItems.totalWeight,
      address: shippingAddress,
      userProfile: userProfile,
      couponCode
    })

    const finalTotal = totalAfterDiscount + shippingCost

    return { total, discount, shippingCost, finalTotal }
  }
}