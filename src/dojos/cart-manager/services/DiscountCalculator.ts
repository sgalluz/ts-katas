import { IDiscountService } from './DiscountService'
import { UserProfile, UserType } from '../models/UserProfile'

export interface IDiscountCalculator {
    calculateDiscount(subtotal: number, profile: UserProfile, couponCode: string | null): number
}

export class DiscountCalculator implements IDiscountCalculator {
  private static readonly FIRST_PURCHASE_DISCOUNT_PCT = 0.10

  constructor(private readonly discountService: IDiscountService) {
  }

  public calculateDiscount(
    subtotal: number,
    profile: UserProfile,
    couponCode: string | null
  ): number {
    const discount = this.getCouponDiscount(couponCode, subtotal, profile)

    return profile.isFirstPurchase && profile.type === UserType.Standard ?
      discount + subtotal * DiscountCalculator.FIRST_PURCHASE_DISCOUNT_PCT :
      discount
  }

  private getCouponDiscount(couponCode: string | null, subtotal: number, profile: UserProfile) {
    if (!couponCode) return 0

    const couponValue = this.discountService.validateCoupon(
      couponCode,
      subtotal,
      profile.type
    )

    return couponValue || 0
  }
}