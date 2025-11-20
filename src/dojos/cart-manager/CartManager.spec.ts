import { CartManager } from './CartManager'
import { UserProfile, UserType } from './models/UserProfile'

describe('Cart Manager', () => {
  const userProfile: UserProfile = {
    id: 1,
    type: UserType.Standard,
    isFirstPurchase: true,
    savedCartItems: []
  }

  let cartManager: CartManager

  beforeEach(() => {
    cartManager = new CartManager(userProfile)
  })

  it('should get the correct first purchase discount', () => {
    // Act
    const updateResult = cartManager.updateCart(1, 1, null, 'VP19')
    const summary = cartManager.getFinalSummary()

    // Assert
    expect(updateResult.success).toBeTruthy()
    expect(updateResult.message).toBe('Cart updated successfully.')

    expect(summary.total).toBe(10)
    expect(summary.discount).toBe(1)
    expect(summary.shippingCost).toBe(10)
    expect(summary.finalTotal).toBe(19)
  })

  it('should get the wrong stacked discount first purchase + coupon', () => {
    // Act
    const updateResult = cartManager.updateCart(2, 1, 'TS_DOJO_20', 'VP19')
    const summary = cartManager.getFinalSummary()

    // Assert
    expect(updateResult.success).toBeTruthy()
    expect(updateResult.message).toBe('Cart updated successfully.')

    expect(summary).toStrictEqual({ total: 20, discount: 6, shippingCost: 10, finalTotal: 24 })
  })
})