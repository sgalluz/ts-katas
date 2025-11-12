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
  })
})