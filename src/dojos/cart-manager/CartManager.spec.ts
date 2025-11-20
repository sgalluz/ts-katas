/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @stylistic/js/semi */
/* eslint-disable @stylistic/js/quotes */
import { CartManager } from "./CartManager";
import { UserProfile, UserType } from "./models/UserProfile";
import { DiscountService } from "./services/DiscountService";

describe("CartManager Constructor", () => {
  it("should call logCartInitialization with the user profile id when user has no saved cart items", () => {
    // Arrange: Spy on console.log
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    const mockUserProfile: UserProfile = {
      id: 123,
      type: UserType.Standard,
      isFirstPurchase: false,
      savedCartItems: [], // Empty to avoid triggering loadInitialCart
    };

    // Act: Create the CartManager (which calls the constructor)
    new CartManager(mockUserProfile);

    // Assert: Verify console.log was called with the expected message
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "[LOGGING] Cart initialized for user: 123."
    );

    // Cleanup
    consoleLogSpy.mockRestore();
  });

  it("should call logCartInitialization with the user profile id when user has saved cart items", () => {
    // Arrange: Spy on console.log
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    const mockUserProfile: UserProfile = {
      id: 456,
      type: UserType.Premium,
      isFirstPurchase: false,
      savedCartItems: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
    };

    // Act: Create the CartManager
    new CartManager(mockUserProfile);

    // Assert: Verify console.log was called with the loading message
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Loading 2 saved items for user 456"
    );

    // Also verify the initialization log was called
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "[LOGGING] Cart initialized for user: 456."
    );

    // Cleanup
    consoleLogSpy.mockRestore();
  });

  it("should log loading saved items and call loadInitialCart when user has saved cart items", () => {
    // Arrange: Spy on console.log and loadInitialCart
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    const loadInitialCartSpy = jest.spyOn(
      CartManager.prototype as any,
      "loadInitialCart"
    );

    const mockUserProfile: UserProfile = {
      id: 789,
      type: UserType.Standard,
      isFirstPurchase: true,
      savedCartItems: [
        { productId: 5, quantity: 3 },
        { productId: 10, quantity: 1 },
      ],
    };

    // Act: Create the CartManager
    new CartManager(mockUserProfile);

    // Assert: Verify console.log was called with the loading message
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Loading 2 saved items for user 789"
    );

    // Assert: Verify loadInitialCart was called with the saved items
    expect(loadInitialCartSpy).toHaveBeenCalledWith([
      { productId: 5, quantity: 3 },
      { productId: 10, quantity: 1 },
    ]);

    // Cleanup
    consoleLogSpy.mockRestore();
    loadInitialCartSpy.mockRestore();
  });
});

describe("CartManager getFinalSummary", () => {
  describe("when user is NOT first purchase", () => {
    it("should return zero discount when validateCoupon returns null", () => {
      // Arrange
      const mockUserProfile: UserProfile = {
        id: 100,
        type: UserType.Standard,
        isFirstPurchase: false,
        savedCartItems: [],
      };

      const cartManager = new CartManager(mockUserProfile);
      const validateCouponSpy = jest
        .spyOn(DiscountService, "validateCoupon")
        .mockReturnValue(null);

      // Apply a coupon code
      cartManager.updateCart(1, 2, "TS_DOJO_20");

      // Act
      const result = cartManager.getFinalSummary();

      // Assert: Discount should be zero
      expect(result.discount).toBe(0);

      // Cleanup
      validateCouponSpy.mockRestore();
    });

    it("should return the mocked discount value when validateCoupon returns a value", () => {
      // Arrange
      const mockUserProfile: UserProfile = {
        id: 100,
        type: UserType.Standard,
        isFirstPurchase: false,
        savedCartItems: [],
      };

      const cartManager = new CartManager(mockUserProfile);
      const mockDiscountValue = 50;
      const validateCouponSpy = jest
        .spyOn(DiscountService, "validateCoupon")
        .mockReturnValue(mockDiscountValue);

      // Apply a coupon code
      cartManager.updateCart(1, 2, "TS_DOJO_20");

      // Act
      const result = cartManager.getFinalSummary();

      // Assert: Discount should be the mocked value
      expect(result.discount).toBe(mockDiscountValue);

      // Cleanup
      validateCouponSpy.mockRestore();
    });

    it("should not call DiscountService.validateCoupon when appliedCouponCode is null", () => {
      // Arrange
      const mockUserProfile: UserProfile = {
        id: 101,
        type: UserType.Standard,
        isFirstPurchase: false,
        savedCartItems: [],
      };

      const cartManager = new CartManager(mockUserProfile);
      const validateCouponSpy = jest.spyOn(DiscountService, "validateCoupon");

      // Add item without coupon code
      cartManager.updateCart(1, 2);

      // Act
      cartManager.getFinalSummary();

      // Assert: DiscountService.validateCoupon should NOT be called
      expect(validateCouponSpy).not.toHaveBeenCalled();

      // Cleanup
      validateCouponSpy.mockRestore();
    });
  });

  describe("when user is first purchase", () => {
    it("should return first purchase discount when validateCoupon returns null", () => {
      // Arrange
      const mockUserProfile: UserProfile = {
        id: 200,
        type: UserType.Standard,
        isFirstPurchase: true,
        savedCartItems: [],
      };

      const cartManager = new CartManager(mockUserProfile);
      const validateCouponSpy = jest
        .spyOn(DiscountService, "validateCoupon")
        .mockReturnValue(null);

      // Apply a coupon code (but it returns null)
      cartManager.updateCart(1, 2, "INVALID_CODE");

      // Act
      const result = cartManager.getFinalSummary();

      // Assert: Discount should be 10% of subtotal (first purchase bonus)
      // subtotal = 1 * 10 * 2 = 20, so 10% = 2
      expect(result.discount).toBe(2);

      // Cleanup
      validateCouponSpy.mockRestore();
    });

    it("should add first purchase discount to coupon discount when validateCoupon returns a value", () => {
      // Arrange
      const mockUserProfile: UserProfile = {
        id: 200,
        type: UserType.Standard,
        isFirstPurchase: true,
        savedCartItems: [],
      };

      const cartManager = new CartManager(mockUserProfile);
      const mockDiscountValue = 50;
      const validateCouponSpy = jest
        .spyOn(DiscountService, "validateCoupon")
        .mockReturnValue(mockDiscountValue);

      // Apply a coupon code
      cartManager.updateCart(1, 2, "TS_DOJO_20");

      // Act
      const result = cartManager.getFinalSummary();

      // Assert: Discount should be mocked value + 10% of subtotal
      // subtotal = 1 * 10 * 2 = 20, so 10% = 2, total discount = 50 + 2 = 52
      expect(result.discount).toBe(52);

      // Cleanup
      validateCouponSpy.mockRestore();
    });

    it("should not call DiscountService.validateCoupon when appliedCouponCode is null", () => {
      // Arrange
      const mockUserProfile: UserProfile = {
        id: 201,
        type: UserType.Standard,
        isFirstPurchase: true,
        savedCartItems: [],
      };

      const cartManager = new CartManager(mockUserProfile);
      const validateCouponSpy = jest.spyOn(DiscountService, "validateCoupon");

      // Add item without coupon code
      cartManager.updateCart(1, 2);

      // Act
      cartManager.getFinalSummary();

      // Assert: DiscountService.validateCoupon should NOT be called
      expect(validateCouponSpy).not.toHaveBeenCalled();

      // Cleanup
      validateCouponSpy.mockRestore();
    });
  });
});
