import { IShippingService } from './ShippingService'
import { UserProfile, UserType } from '../models/UserProfile'
import { CheckoutOptions } from '../models/CheckoutOptions'

export interface ShippingCalculationContext {
    totalPrice: number
    totalWeight: number
    userProfile: UserProfile
    checkoutOptions: CheckoutOptions
}

export interface IShippingCalculator {
    calculateShipping(context: ShippingCalculationContext): number
}

export class ShippingCalculator {
  private static readonly BASE_SHIPPING_FEE = 15
  private static readonly EXTRA_FEE = 10
  private static readonly SHIPPING_FEE_THRESHOLD = 200
  private static readonly BASE_SHIPPING_FEE_AMOUNT_THRESHOLD = 100
  private static readonly FREE_SHIPPING_MIN_AMOUNT = 50

  constructor(private readonly shippingService: IShippingService) {
  }

  public calculateShipping(context: ShippingCalculationContext): number {
    const { totalPrice, totalWeight, userProfile, checkoutOptions } = context
    const { shippingAddress = '', couponCode = null } = checkoutOptions

    const shippingCost = this.getBaseShippingCost(totalPrice, shippingAddress, totalWeight, couponCode)

    const shouldApplyExtraFee = userProfile.type === UserType.Guest
            && totalPrice + shippingCost > ShippingCalculator.SHIPPING_FEE_THRESHOLD
    const extraFee = shouldApplyExtraFee ? ShippingCalculator.EXTRA_FEE : 0

    return shippingCost + extraFee
  }

  private getBaseShippingCost(price: number, address: string, weight: number, couponCode: string | null) {
    if (price < ShippingCalculator.FREE_SHIPPING_MIN_AMOUNT && address) return this.shippingService.calculate(address, weight)
    const hasFreeShipping = couponCode === 'FREE_SHIPPING' || price >= ShippingCalculator.BASE_SHIPPING_FEE_AMOUNT_THRESHOLD
    return hasFreeShipping ? 0 : ShippingCalculator.BASE_SHIPPING_FEE
  }
}