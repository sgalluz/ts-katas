import { CartManager } from './CartManager'
import { UserProfile, UserType } from './models/UserProfile'
import { IDiscountService } from './services/DiscountService'
import { IShippingService } from './services/ShippingService'
import { Logger } from './services/Logger'
import { DiscountCalculator } from './services/DiscountCalculator'
import { ShippingCalculator } from './services/ShippingCalculator'
import { Notifier } from './services/Notifier'
import { Product } from './models/Product'
import { aUser } from './utils/UserProfileBuilder'
import { ProductRepository } from './repositories/ProductRepository'
import { CartItems } from './models/CartItems'

const mockDiscountService: jest.Mocked<IDiscountService> = { validateCoupon: jest.fn() }
const mockShippingService: jest.Mocked<IShippingService> = { calculate: jest.fn() }
const mockLogger: jest.Mocked<Logger> = { log: jest.fn(), warn: jest.fn() }
const mockProductRepository: jest.Mocked<ProductRepository> = { getProductById: jest.fn() }

const buildCartManager = (user: UserProfile) => {
  const discountCalculator = new DiscountCalculator(mockDiscountService)
  const shippingCalculator = new ShippingCalculator(mockShippingService)
  const notifier = new Notifier(mockLogger)

  const items = user.savedCartItems.map(({ productId, quantity }) => ({
    product: buildProduct(productId), quantity
  }))

  return new CartManager(user, new CartItems(items), mockProductRepository, discountCalculator, shippingCalculator, notifier, mockLogger)
}

const buildProduct = (id: number): Product => ({
  id, name: `Product ${id}`, price: id * 10, weightKg: 1
})

describe('CartManager', () => {
  beforeEach(() => mockProductRepository.getProductById.mockImplementation(buildProduct))

  afterEach(() => jest.clearAllMocks())

  describe('when invoking the constructor', () => {
    it('should log the cart initialization and load the cart items via repository', () => {
      const userId = 123
      const user = aUser()
        .withId(userId)
        .asStandard()
        .withSavedItem(1, 1)
        .build()

      buildCartManager(user)

      expect(mockLogger.log).toHaveBeenCalledWith(`[LOGGING] Cart initialized for user: ${userId}.`)
    })

    it('should not load the cart in case of no items previously saved in cart', () => {
      const profile = aUser()
        .withId(456)
        .asPremium()
        .asFirstPurchase()
        .build()

      buildCartManager(profile)

      expect(mockLogger.log).toHaveBeenCalledWith('[LOGGING] Cart initialized for user: 456.')
    })

    it('should log number of saved items being loaded and retrieve each product', () => {
      const profile = aUser()
        .withId(100)
        .asStandard()
        .withSavedItem(1, 1)
        .withSavedItem(2, 2)
        .build()

      buildCartManager(profile)

      expect(mockLogger.log).toHaveBeenCalledWith('[LOGGING] Cart initialized for user: 100.')
    })
  })

  describe('when updating the cart', () => {
    it('should add two pieces of the same product to the cart', () => {
      const user = aUser().build()
      const cartManager = buildCartManager(user)

      const actual = cartManager.updateCart(1, 2)

      expect(actual.success).toBeTruthy()
      expect(actual.message).toEqual('Cart updated successfully.')
    })

    it('should prevent VIP user from adding expensive product', () => {
      const user = aUser()
        .withId(999)
        .asPremium()
        .build()
      const cartManager = buildCartManager(user)

      const actual = cartManager.updateCart(11, 1)

      expect(actual.success).toBeFalsy()
      expect(actual.message).toEqual('VIP user 999 cannot purchase expensive items directly.')
    })

    it('should update the quantity of the existing item', () => {
      const user = aUser()
        .withId(3)
        .withSavedItem(1, 2)
        .build()
      const cartManager = buildCartManager(user)

      const actual = cartManager.updateCart(1, 5)

      expect(actual.success).toBeTruthy()
      expect(actual.message).toEqual('Cart updated successfully.')
    })

    it('should remove an item from the cart when its quantity is equal or less than zero', () => {
      const user = aUser()
        .withId(2)
        .withSavedItem(1, 2)
        .build()
      const cartManager = buildCartManager(user)

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
      const user = aUser().withId(4).build()
      const cartManager = buildCartManager(user)

      const actual = cartManager.getFinalSummary()

      expect(actual).toEqual({
        total: 0,
        discount: 0,
        shippingCost: 15, // here's the strange behavior as it charges shipping on empty cart
        finalTotal: 15
      })
    })

    it('should apply first purchase discount for standard users', () => {
      const user = aUser()
        .withId(5)
        .asFirstPurchase()
        .build()
      const cartManager = buildCartManager(user)
      cartManager.updateCart(2, 1)

      const actual = cartManager.getFinalSummary()

      expect(actual).toEqual({
        total: 20,
        discount: 2,
        shippingCost: 15,
        finalTotal: 33
      })
    })

    it.each([
      { type: UserType.Premium, label: UserType.Premium.toLowerCase() },
      { type: UserType.Guest, label: UserType.Guest.toLowerCase() },
    ])('should not apply first purchase discount for $label users', ({ type }) => {
      const user = aUser()
        .withId(7)
        .asFirstPurchase()
        .build()
      user.type = type // Override type dopo build

      const cartManager = buildCartManager(user)
      cartManager.updateCart(2, 1)

      const actual = cartManager.getFinalSummary()
      expect(actual).toEqual({
        total: 20,
        discount: 0,
        shippingCost: 15,
        finalTotal: 35
      })
    })

    describe('and interact with external services', () => {
      beforeEach(() => {
        mockDiscountService.validateCoupon.mockReturnValue(4)
        mockShippingService.calculate.mockReturnValue(25)
      })

      afterEach(() => jest.clearAllMocks())

      it('should invoke discount service with correct user type and calculate total accordingly', () => {
        mockDiscountService.validateCoupon.mockReturnValue(4)

        const user = aUser()
          .withId(10)
          .asPremium()
          .build()
        const cartManager = buildCartManager(user)
        cartManager.updateCart(4, 1, 'TS_DOJO_20')

        const actual = cartManager.getFinalSummary()

        expect(actual).toEqual({
          total: 40,
          discount: 4,
          shippingCost: 15,
          finalTotal: 51
        })
        expect(mockDiscountService.validateCoupon).toHaveBeenCalledWith('TS_DOJO_20', 40, UserType.Premium)
      })

      it('should calulate wieght-based shipping cost correctly', () => {
        const user = aUser()
          .withId(11)
          .build()
        const cartManager = buildCartManager(user)
        cartManager.updateCart(4, 1, undefined, '123 Main St, Island City')

        const actual = cartManager.getFinalSummary()

        expect(actual).toEqual({
          total: 40,
          discount: 0,
          shippingCost: 25,
          finalTotal: 65
        })
        expect(mockShippingService.calculate).toHaveBeenCalledWith('123 Main St, Island City', 1)
      })
    })

    describe('and order total exceeds free validation thresholds', () => {
      it('should apply extra fees for orders above $200', () => {
        const user = aUser()
          .withId(11)
          .asGuest()
          .build()
        const cartManager = buildCartManager(user)
        cartManager.updateCart(5, 5)

        const actual = cartManager.getFinalSummary()

        expect(actual).toEqual({
          total: 250,
          discount: 0,
          shippingCost: 10,
          finalTotal: 260
        })
      })

      it('should send high value order alert for big orders', () => {
        const user = aUser()
          .withId(12)
          .withSavedItems([
            { productId: 1, quantity: 10 },
            { productId: 2, quantity: 5 },
            { productId: 3, quantity: 4 },
            { productId: 4, quantity: 3 },
            { productId: 5, quantity: 1 },
          ])
          .build()
        const cartManager = buildCartManager(user)
        cartManager.updateCart(6, 1)

        const actual = cartManager.getFinalSummary()

        expect(actual).toEqual({
          total: 550,
          discount: 0,
          shippingCost: 0,
          finalTotal: 550
        })
        expect(mockLogger.log).toHaveBeenCalledWith('*** NOTIFICATION ***: User 12 has a high-value cart: 550')
      })
    })
  })
})