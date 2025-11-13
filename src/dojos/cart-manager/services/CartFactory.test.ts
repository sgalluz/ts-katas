import { Logger } from './Logger'
import { ProductRepository } from './ProductRepository'
import { UserProfile, UserType } from '../models/UserProfile'
import { IDiscountCalculator } from './DiscountCalculator'
import { Notifier } from './Notifier'
import { CartFactory } from './CartFactory'
import { IShippingCalculator } from './ShippingCalculator'

// FIXME: builder temporary duplicated
class UserProfileBuilder {
  private profile: UserProfile = { id: 1, type: UserType.Standard, isFirstPurchase: false, savedCartItems: [] }

  withId(id: number): this {
    this.profile.id = id
    return this
  }

  asGuest(): this {
    this.profile.type = UserType.Guest
    return this
  }

  asStandard(): this {
    this.profile.type = UserType.Standard
    return this
  }

  asPremium(): this {
    this.profile.type = UserType.Premium
    return this
  }

  asFirstPurchase(): this {
    this.profile.isFirstPurchase = true
    return this
  }

  withSavedItem(productId: number, quantity: number): this {
    this.profile.savedCartItems.push({ productId, quantity })
    return this
  }

  withSavedItems(items: { productId: number, quantity: number }[]): this {
    this.profile.savedCartItems = items
    return this
  }

  build(): UserProfile {
    return { ...this.profile }
  }
}

const aUser = () => new UserProfileBuilder()


const mockDiscountCalculator: jest.Mocked<IDiscountCalculator> = { calculateDiscount: jest.fn() }
const mockShippingCalculator: jest.Mocked<IShippingCalculator> = { calculateShipping: jest.fn() }
const mockLogger: jest.Mocked<Logger> = { log: jest.fn(), warn: jest.fn() }
const mockProductRepository: jest.Mocked<ProductRepository> = { getProductById: jest.fn() }

const buildCartFactory = (): CartFactory => new CartFactory(
  mockProductRepository,
  mockDiscountCalculator,
  mockShippingCalculator,
  new Notifier(mockLogger),
  mockLogger
)

describe('CartFactory', () => {
  beforeEach(() => mockProductRepository.getProductById.mockImplementation((productId: number) => ({
    id: productId,
    name: `Product ${productId}`,
    price: productId * 10,
    weightKg: 1
  })))

  afterEach(() => jest.clearAllMocks())

  describe('when invoking the constructor', () => {
    it('should log the cart initialization and load the cart items via repository', () => {
      const userId = 123
      const user = aUser()
        .withId(userId)
        .asStandard()
        .withSavedItem(1, 1)
        .build()

      buildCartFactory().createCartForUser(user)

      expect(mockLogger.log).toHaveBeenCalledWith(`[LOGGING] Cart initialized for user: ${userId}.`)
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(1)
    })

    it('should not load the cart in case of no items previously saved in cart', () => {
      const profile = aUser()
        .withId(456)
        .asPremium()
        .asFirstPurchase()
        .build()

      buildCartFactory().createCartForUser(profile)

      expect(mockLogger.log).toHaveBeenCalledWith('[LOGGING] Cart initialized for user: 456.')
      expect(mockProductRepository.getProductById).not.toHaveBeenCalled()
    })

    it('should log number of saved items being loaded and retrieve each product', () => {
      const profile = aUser()
        .withId(100)
        .asStandard()
        .withSavedItem(1, 1)
        .withSavedItem(2, 2)
        .build()

      buildCartFactory().createCartForUser(profile)

      expect(mockLogger.log).toHaveBeenCalledWith('Loading 2 saved items for user 100')
      expect(mockLogger.log).toHaveBeenCalledWith('[LOGGING] Cart initialized for user: 100.')
      expect(mockProductRepository.getProductById).toHaveBeenCalledTimes(4)
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(1)
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(2)
      // will become valid when the CartManager constructor will be cleaned
      // expect(mockProductRepository.getProductById).toHaveBeenCalledTimes(2)
      // expect(mockProductRepository.getProductById).toHaveBeenCalledWith(1)
      // expect(mockProductRepository.getProductById).toHaveBeenCalledWith(2)
    })
  })

})