import { UserType } from '../models/UserProfile'

export interface IDiscountService {
    validateCoupon(code: string, total: number, userType: UserType): number | null;
}

export class DiscountServiceV2 implements IDiscountService {
  public validateCoupon(code: string, total: number, userType: UserType): number | null {
    return DiscountService.validateCoupon(code, total, userType)
  }
}

/**
 * Simulates an external service for discount validation.
 * Now also depends on UserType.
 * This static method creates tight coupling and make mocking in tests more difficult.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DiscountService {
  public static validateCoupon(code: string, total: number, userType: UserType): number | null {
    console.log(`[EXTERNAL] Validating coupon ${code} for user ${userType}...`)

    let discountPercent = 0

    if (code === 'TS_DOJO_20') {
      discountPercent = 0.20
    } else if (code === 'PREMIUM_50' && userType === UserType.Premium) {
      discountPercent = 0.50 // Exclusive discount for Premium
    } else if (code === 'PREMIUM_50' && userType !== UserType.Premium) {
      return null // Fails silently
    }

    if (code === 'FREE_SHIPPING') return 0 // Free shipping (still poorly handled here!)

    return total * discountPercent
  }
}