import { UserProfile } from '../models/UserProfile'
import { Product } from '../models/Product'

export interface ICartValidator {
  canAddProduct(userProfile: UserProfile, product: Product): { valid: boolean; reason?: string }
  isHighValueOrder(finalTotal: number, itemsCount: number): boolean
}

export class CartValidator implements ICartValidator {
  private static readonly VIP_USER_ID = 999
  private static readonly EXPENSIVE_PRODUCT_THRESHOLD = 100
  private static readonly HIGH_VALUE_ORDER_THRESHOLD = 500
  private static readonly HIGH_VALUE_ORDER_MIN_ITEMS = 5

  canAddProduct(userProfile: UserProfile, product: Product): { valid: boolean; reason?: string } {
    if (userProfile.id === CartValidator.VIP_USER_ID && product.price > CartValidator.EXPENSIVE_PRODUCT_THRESHOLD) {
      return {
        valid: false,
        reason: 'VIP user 999 cannot purchase expensive items directly.'
      }
    }

    return { valid: true }
  }

  isHighValueOrder(finalTotal: number, itemsCount: number): boolean {
    return finalTotal > CartValidator.HIGH_VALUE_ORDER_THRESHOLD
      && itemsCount > CartValidator.HIGH_VALUE_ORDER_MIN_ITEMS
  }
}