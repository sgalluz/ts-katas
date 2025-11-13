import { IShippingService } from './ShippingService'
import { UserProfile, UserType } from '../models/UserProfile'

export interface IShippingCalculator {
    calculateShipping(totalAfterDiscount: number, totalWeight: number, address: string, profile: UserProfile, couponCode: string | null): number
}

export class ShippingCalculator {
  private static readonly BASE_SHIPPING_FEE = 15
  private static readonly EXTRA_FEE = 10
  private static readonly SHIPPING_FEE_THRESHOLD = 200
  private static readonly BASE_SHIPPING_FEE_AMOUNT_THRESHOLD = 100


  constructor(private readonly shippingService: IShippingService) {
  }

  // FIXME: this should be imprpoved as five parameters for a method is too many...

  public calculateShipping(
    totalAfterDiscount: number,
    totalWeight: number,
    address: string,
    profile: UserProfile,
    couponCode: string | null
  ): number {
    const shippingCost = this.getBaseShippingCost(totalAfterDiscount, address, totalWeight, couponCode)

    const shouldApplyExtraFee = profile.type === UserType.Guest
            && totalAfterDiscount + shippingCost > ShippingCalculator.SHIPPING_FEE_THRESHOLD
    const extraFee = shouldApplyExtraFee ? ShippingCalculator.EXTRA_FEE : 0

    return shippingCost + extraFee
  }

  private getBaseShippingCost(totalAfterDiscount: number, address: string, totalWeight: number, couponCode: string | null) {
    if (totalAfterDiscount < 50 && address) {
      return this.shippingService.calculate(address, totalWeight)
    }

    return couponCode === 'FREE_SHIPPING' || totalAfterDiscount >= ShippingCalculator.BASE_SHIPPING_FEE_AMOUNT_THRESHOLD
      ? 0
      : ShippingCalculator.BASE_SHIPPING_FEE
  }
}