import { CartManager } from './CartManager'
import { UserProfile, UserType } from './models/UserProfile'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {
}

describe('CartManager', () => {
  describe('when invoking the constructor', () => {
    let logSpy: jest.SpyInstance,
      loadCartSpy: jest.SpyInstance

    beforeEach(() => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      logSpy = jest.spyOn(CartManager.prototype as any, 'logCartInitialization').mockImplementation(noop)
      loadCartSpy = jest.spyOn(CartManager.prototype as any, 'loadInitialCart').mockImplementation(noop)
      /* eslint-enable @typescript-eslint/no-explicit-any */
    })

    afterEach(() => jest.restoreAllMocks())

    it('should log the cart initialization and load the cart', () => {
      const userId = 123
      const user: UserProfile = {
        id: userId, type: UserType.Standard, isFirstPurchase: false,
        savedCartItems: [{ productId: 1, quantity: 1 }]
      }

      new CartManager(user)

      expect(logSpy).toHaveBeenCalledWith(userId)
      expect(loadCartSpy).toHaveBeenCalledWith(user.savedCartItems)
    })

    it('should not load the cart in case of no items previously saved in cart', () => {
      const profile: UserProfile = {
        id: 456,
        type: UserType.Premium,
        isFirstPurchase: true,
        savedCartItems: []
      }

      new CartManager(profile)

      expect(loadCartSpy).not.toHaveBeenCalled()
    })

    it('should log number of saved items being loaded', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      const profile: UserProfile = {
        id: 100,
        type: UserType.Standard,
        isFirstPurchase: false,
        savedCartItems: [
          { productId: 1, quantity: 1 },
          { productId: 2, quantity: 2 }
        ]
      }

      new CartManager(profile)

      expect(consoleSpy).toHaveBeenCalledWith('Loading 2 saved items for user 100')
    })
  })

  describe('when updating the cart', () => {
    it('should add two pieces of the same product to the cart', () => {
      const user: UserProfile = {
        id: 1,
        type: UserType.Standard,
        isFirstPurchase: false,
        savedCartItems: []
      }
      const cartManager = new CartManager(user)

      const actual = cartManager.updateCart(1, 2)

      expect(actual.success).toBeTruthy()
      expect(actual.message).toEqual('Cart updated successfully.')
    })

    it('should prevent VIP user from adding expensive product', () => {
      const user: UserProfile = {
        id: 999,
        type: UserType.Premium,
        isFirstPurchase: false,
        savedCartItems: []
      }
      const cartManager = new CartManager(user)

      const actual = cartManager.updateCart(11, 1)

      expect(actual.success).toBeFalsy()
      expect(actual.message).toEqual('VIP user 999 cannot purchase expensive items directly.')
    })

    it('should update the quantity of the existing item', () => {
      const user: UserProfile = {
        id: 3,
        type: UserType.Standard,
        isFirstPurchase: false,
        savedCartItems: [{ productId: 1, quantity: 2 }]
      }
      const cartManager = new CartManager(user)

      const actual = cartManager.updateCart(1, 5)

      expect(actual.success).toBeTruthy()
      expect(actual.message).toEqual('Cart updated successfully.')
    })

    it('should remove an item from the cart when its quantity is equal or less than zero', () => {
      const user: UserProfile = {
        id: 2,
        type: UserType.Standard,
        isFirstPurchase: false,
        savedCartItems: [{ productId: 1, quantity: 2 }]
      }
      const cartManager = new CartManager(user)

      const actual = cartManager.updateCart(1, 0)

      expect(actual.success).toBeTruthy()
      expect(actual.message).toEqual('Item removed or zero quantity ignored.')
    })
  })

  describe('when asking for the final summary', () => {
    // Here we see the real value of characterization tests while refactoring a legacy class.
    // The test is highlighting that getFinalSummary method is not working as expected,
    // as it is applying shipping cost also when users have no items in the cart.
    // A refactor without this test would likely have missed this edge case and introduced a regression.
    it('should return zero totals for an empty cart', () => {
      const user: UserProfile = {
        id: 4,
        type: UserType.Standard,
        isFirstPurchase: false,
        savedCartItems: []
      }
      const cartManager = new CartManager(user)

      const actual = cartManager.getFinalSummary()

      expect(actual).toEqual({
        total: 0,
        discount: 0,
        shippingCost: 15, // here's the strange behavior as it charges shipping on empty cart
        finalTotal: 15
      })
    })

    it('should apply first purchase discount for standard users', () => {
      const user: UserProfile = {
        id: 5,
        type: UserType.Standard,
        isFirstPurchase: true,
        savedCartItems: []
      }
      const cartManager = new CartManager(user)
      cartManager.updateCart(2, 1)

      const actual = cartManager.getFinalSummary()

      expect(actual).toEqual({
        total: 20,
        discount: 2,
        shippingCost: 15,
        finalTotal: 33
      })
    })
  })
})