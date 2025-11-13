import { IShippingService } from './ShippingService'
import { UserProfile, UserType } from '../models/UserProfile'

export interface IShippingCalculator {
    calculateShipping(totalAfterDiscount: number, totalWeight: number, address: string, profile: UserProfile, couponCode: string | null): number
}

export class ShippingCalculator {
  private static readonly BASE_SHIPPING_FEE = 15
  private static readonly EXTRA_FEE = 10

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

    const shouldApplyExtraFee = profile.type === UserType.Guest && totalAfterDiscount + shippingCost > 200
    const extraFee = shouldApplyExtraFee ? ShippingCalculator.EXTRA_FEE : 0

    return shippingCost + extraFee
  }

  private getBaseShippingCost(totalAfterDiscount: number, address: string, totalWeight: number, couponCode: string | null) {
    if (totalAfterDiscount < 50 && address) {
      return this.shippingService.calculate(address, totalWeight)
    }

    return couponCode === 'FREE_SHIPPING' || totalAfterDiscount >= 100 ? 0 : ShippingCalculator.BASE_SHIPPING_FEE
  }
}