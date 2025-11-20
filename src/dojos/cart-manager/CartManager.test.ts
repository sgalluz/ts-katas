import { CartManager } from './CartManager'
import { UserProfile, UserType } from './models/UserProfile'
import * as ProductModule from './models/Product'

describe('CartManager Constructor', () => {
  let consoleSpy: jest.SpyInstance
  let buildProductSpy: jest.SpyInstance

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
      // Mock implementation
    })
    buildProductSpy = jest.spyOn(ProductModule, 'buildProduct').mockImplementation((id) => ({
      id,
      name: `Product ${id}`,
      price: id * 10,
      weightKg: 1
    }))
  })

  afterEach(() => {
    consoleSpy.mockRestore()
    buildProductSpy.mockRestore()
  })

  it('should create CartManager instance with minimal user profile ', () => {
    const userProfile: UserProfile = {
      id: 1,
      type: UserType.Standard,
      isFirstPurchase: false,
      savedCartItems: []
    }

    const cartManager = new CartManager(userProfile)

    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Loading'))
    expect(cartManager).toBeInstanceOf(CartManager)
    expect(consoleSpy).toHaveBeenCalledWith('[LOGGING] Cart initialized for user: 1.')
    expect(cartManager.getItems().length).toBe(0)
  })

  it('should load saved cart items when user profile contains them', () => {
    const userProfile: UserProfile = {
      id: 123,
      type: UserType.Standard,
      isFirstPurchase: false,
      savedCartItems: [
        { productId: 1, quantity: 2 },
        { productId: 3, quantity: 1 }
      ]
    }

    const cartManager = new CartManager(userProfile)
    expect(cartManager.getItems().length).toBe(2)
    cartManager.getItems().forEach((item, index) => {
      expect(item.product.id).toBe(userProfile.savedCartItems[index].productId)
      expect(item.quantity).toBe(userProfile.savedCartItems[index].quantity)
      expect(item.product.name).toBe(`Product ${userProfile.savedCartItems[index].productId}`)
      expect(item.product.price).toBe(userProfile.savedCartItems[index].productId * 10)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Loading 2 saved items for user 123')
    expect(consoleSpy).toHaveBeenCalledWith('[LOGGING] Cart initialized for user: 123.')
  })
})

describe('CartManager updateCart update items', () => {
  let consoleSpy: jest.SpyInstance
  let buildProductSpy: jest.SpyInstance
  let cartManager: CartManager

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
      // Mock implementation
    })
    buildProductSpy = jest.spyOn(ProductModule, 'buildProduct').mockImplementation((id) => ({
      id,
      name: `Product ${id}`,
      price: id * 10,
      weightKg: 1
    }))
    const userProfile: UserProfile = {
      id: 1,
      type: UserType.Standard,
      isFirstPurchase: false,
      savedCartItems: []
    }
    cartManager = new CartManager(userProfile)
  })

  afterEach(() => {
    consoleSpy.mockRestore()
    buildProductSpy.mockRestore()
  })

  describe('Basic item updates', () => {

    it('should allow cheap items for VIP user 999', () => {
      const vipUserProfile: UserProfile = {
        id: 999,
        type: UserType.Premium,
        isFirstPurchase: false,
        savedCartItems: []
      }
      const vipCartManager = new CartManager(vipUserProfile)

      const result = vipCartManager.updateCart(5, 1) // Product 5 costs 50 (< 100)

      expect(result).toEqual({ success: true, message: 'Cart updated successfully.' })
      expect(vipCartManager.getItems()).toHaveLength(1)
    })

    it('should allow expensive items for non-VIP users', () => {
      const result = cartManager.updateCart(20, 1) // Product 20 costs 200 (> 100)

      expect(result).toEqual({ success: true, message: 'Cart updated successfully.' })
      expect(cartManager.getItems()).toHaveLength(1)
    })

    it('should create products with correct properties based on productId', () => {
      cartManager.updateCart(7, 1)

      const item = cartManager.getItems()[0]
      expect(item.product.id).toBe(7)
      expect(item.product.name).toBe('Product 7')
      expect(item.product.price).toBe(70) // productId * 10
      expect(item.product.weightKg).toBe(1)
    })

    it('should reject expensive items for VIP user 999', () => {
      const vipUserProfile: UserProfile = {
        id: 999,
        type: UserType.Premium,
        isFirstPurchase: false,
        savedCartItems: []
      }
      const vipCartManager = new CartManager(vipUserProfile)

      const result = vipCartManager.updateCart(15, 1) // Product 15 costs 150 (> 100)

      expect(result).toEqual({
        success: false,
        message: 'VIP user 999 cannot purchase expensive items directly.'
      })
      expect(vipCartManager.getItems()).toHaveLength(0)
    })

    it('should add new items to cart', () => {
      let result = cartManager.updateCart(10, 2)

      expect(result).toEqual({ success: true, message: 'Cart updated successfully.' })
      expect(cartManager.getItems()).toHaveLength(1)
      expect(cartManager.getItems()[0].product.id).toBe(10)
      expect(cartManager.getItems()[0].quantity).toBe(2)

      result = cartManager.updateCart(20, 1)
      expect(result).toEqual({ success: true, message: 'Cart updated successfully.' })
      expect(cartManager.getItems()).toHaveLength(2)
    })

    it('should update existing item quantity', () => {
      cartManager.updateCart(10, 2)
      const result = cartManager.updateCart(10, 5)

      expect(result).toEqual({ success: true, message: 'Cart updated successfully.' })
      expect(cartManager.getItems()).toHaveLength(1)
      expect(cartManager.getItems()[0].quantity).toBe(5)
    })

    it('should remove item when quantity is 0', () => {
      cartManager.updateCart(10, 2)
      const result = cartManager.updateCart(10, 0)

      expect(result).toEqual({ success: true, message: 'Item removed or zero quantity ignored.' })
      expect(cartManager.getItems()).toHaveLength(0)
    })

    it('should remove item when quantity is negative', () => {
      cartManager.updateCart(100, 2)
      const result = cartManager.updateCart(100, -1)

      expect(result).toEqual({ success: true, message: 'Item removed or zero quantity ignored.' })
      expect(cartManager.getItems()).toHaveLength(0)
    })

    it('should ignore zero quantity for non-existing item', () => {
      const result = cartManager.updateCart(10, 0)

      expect(result).toEqual({ success: true, message: 'Item removed or zero quantity ignored.' })
      expect(cartManager.getItems()).toHaveLength(0)
    })
  })

  it('should update coupon code', () => {
    const result = cartManager.updateCart(10, 2, 'DISCOUNT10')

    expect(result).toEqual({ success: true, message: 'Cart updated successfully.' })
    expect(cartManager.getAppliedCouponCode()).toBe('DISCOUNT10')
  })

  it('should update shipping address', () => {
    const result = cartManager.updateCart(10, 2, null, '123 Main St')

    expect(result).toEqual({ success: true, message: 'Cart updated successfully.' })
    expect(cartManager.getShippingAddress()).toBe('123 Main St')
  })

  it('should call buildProduct with correct productId', () => {
    cartManager.updateCart(42, 1)

    expect(buildProductSpy).toHaveBeenCalledWith(42)
    expect(buildProductSpy).toHaveBeenCalledTimes(1)
  })

  it('should call buildProduct for each update', () => {
    cartManager.updateCart(10, 1)
    cartManager.updateCart(20, 2)
    cartManager.updateCart(10, 3)

    expect(buildProductSpy).toHaveBeenCalledTimes(3)
    expect(buildProductSpy).toHaveBeenNthCalledWith(1, 10)
    expect(buildProductSpy).toHaveBeenNthCalledWith(2, 20)
    expect(buildProductSpy).toHaveBeenNthCalledWith(3, 10)
  })
})