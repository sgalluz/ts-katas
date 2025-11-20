import exp from 'constants'
import { CartManager } from './CartManager'
import { UserProfile, UserType } from './models/UserProfile'
import { totalmem } from 'os'
import { disconnect } from 'process'

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

    jest.spyOn(console, 'log').mockImplementation(() => {
      return (message: string) => {
        return message
      }
    })
  })

  it('logs the cart initialization', () => {
    // Act

    new CartManager(userProfile)

    // Assert  
    expect(console.log).toHaveBeenCalledWith('[LOGGING] Cart initialized for user: 1.')
    jest.restoreAllMocks()
  })

  it('for already present saved cart items in profile, loads them into the cart', () => {
    // Act

    new CartManager(userProfile)
    expect(console.log).toHaveBeenCalledWith('[LOGGING] Cart initialized for user: 1.')

    const filledUserProfile: UserProfile = {
      id: 1,
      type: UserType.Standard,
      isFirstPurchase: true,
      savedCartItems: [{ productId: 2, quantity: 3 }]
    }

    new CartManager(filledUserProfile)


    // Assert
    expect(console.log).toHaveBeenCalledWith('Loading 1 saved items for user 1')
    expect(console.log).toHaveBeenCalledWith('[LOGGING] Cart initialized for user: 1.')

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

    it('should remove item if item exists', () => {
    cartManager.updateCart(2, 1, 'TS_DOJO_20', 'VP19')
    cartManager.updateCart(3, 4, null, 'VP19')

    const updateResult = cartManager.updateCart(2, -2, null, 'VP19')

    expect(updateResult.success).toBeTruthy();
    expect(updateResult.message).toBe('Item removed or zero quantity ignored.')
    })

    it('should return empty cart with shipping cost when removing an existing item ', () => {
    cartManager.updateCart(3, 1, 'TS_DOJO_20', 'VP19')
    cartManager.updateCart(3, 0, "TS_DOJO_20", "VP19");

    const result = cartManager.getFinalSummary();

    expect(result).toStrictEqual({total: 0, discount: 0, shippingCost: 10, finalTotal: 10})
    })


    it('should return shipping cost of 10 when no shipping address is given', () => {
        cartManager.updateCart(2, 1, "", undefined);

        const result = cartManager.getFinalSummary();
        expect(result).toStrictEqual({total: 20, discount: 2, shippingCost: 15, finalTotal: 33})
    })

})