/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @stylistic/js/semi */
/* eslint-disable @stylistic/js/quotes */
import { CartManager } from "./CartManager";
import { UserProfile, UserType } from "./models/UserProfile";

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
