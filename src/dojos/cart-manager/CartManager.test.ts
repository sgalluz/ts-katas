import { randomInt } from "crypto"
import { CartManager } from "./CartManager"
import type { UserProfile } from './models/UserProfile'
import { UserType } from './models/UserProfile'

describe('cartManager', () => {
    it('should initiate cartManager and add 1 item', () => {
        const userProfile: UserProfile = { id: 1, type: UserType.Guest, isFirstPurchase: false, savedCartItems: [] };
        const cartManager = new CartManager(userProfile);
        expect(cartManager).toBeDefined();

        const result = cartManager.getFinalSummary();
        expect(result).toBeDefined();
        expect(result.total).toBe(0);
        expect(result.discount).toBe(0);
        expect(result.shippingCost).toBe(15);
        expect(result.finalTotal).toBe(15);

        //const randomId = randomInt(10);
        const id = 3;

        const updateCart = cartManager.updateCart(id, 1);
        expect(updateCart.success).toBeTruthy();

        const newCart = cartManager.getFinalSummary();

        expect(newCart).toBeDefined();
        expect(newCart.total).toBe(30);
        expect(newCart.discount).toBe(0);
        expect(newCart.shippingCost).toBe(15);
        expect(newCart.finalTotal).toBe(45);
    })

    it('should initiate a old user with a saved cart', () => {
        const userProfile: UserProfile = { id: 2, type: UserType.Guest, isFirstPurchase: true, savedCartItems: [{productId: 1, quantity:1}] };
        const cartManager = new CartManager(userProfile);
        expect(cartManager).toBeDefined();

        const result = cartManager.getFinalSummary();
        console.log(result);
        expect(result).toBeDefined();
        expect(result.total).toBe(10);
        expect(result.discount).toBe(0);
        expect(result.shippingCost).toBe(15);
        expect(result.finalTotal).toBe(25);
    })

      it('should remove one item from cart', () => {
        const userProfile: UserProfile = { id: 2, type: UserType.Guest, isFirstPurchase: true, savedCartItems: [{productId: 1, quantity:1}] };
        const cartManager = new CartManager(userProfile);
        expect(cartManager).toBeDefined();

        const emptyCart = cartManager.updateCart(1, -1);
        expect(emptyCart.success).toBeTruthy()
        const result = cartManager.getFinalSummary();
        console.log(result);
        expect(result).toBeDefined();
        expect(result.total).toBe(0);
        expect(result.discount).toBe(0);
        expect(result.shippingCost).toBe(15);
        expect(result.finalTotal).toBe(15);
    })

    it('should initiate cartManager and remove 1 item', () => {
        const userProfile: UserProfile = { id: 1, type: UserType.Guest, isFirstPurchase: false, savedCartItems: [] };
        const cartManager = new CartManager(userProfile);
        expect(cartManager).toBeDefined();

        const result = cartManager.getFinalSummary();
        expect(result).toBeDefined();
        expect(result.total).toBe(0);
        expect(result.discount).toBe(0);
        expect(result.shippingCost).toBe(15);
        expect(result.finalTotal).toBe(15);

        //const randomId = randomInt(10);
        const id = 3;

        const updateCart = cartManager.updateCart(id, -1);
        //expect(updateCart.success).toBeTruthy();

        const newCart = cartManager.getFinalSummary();
        // expect(newCart).toBeDefined();
        // expect(newCart.total).toBe(30);
        // expect(newCart.discount).toBe(0);
        // expect(newCart.shippingCost).toBe(15);
        // expect(newCart.finalTotal).toBe(45);
    })

    it('should apply discount', () => {
        const userProfile: UserProfile = { id: 1, type: UserType.Standard, isFirstPurchase: true, savedCartItems: [{productId: 1, quantity:1}] };
        const cartManager = new CartManager(userProfile);
        expect(cartManager).toBeDefined();

        const result = cartManager.getFinalSummary();
       console.log(result);
    })

})

