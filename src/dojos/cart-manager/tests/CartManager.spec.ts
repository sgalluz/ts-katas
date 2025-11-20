import {CartManager} from '../CartManager'
import {UserProfile, UserType} from '../models/UserProfile'
import {Product} from '../models/Product'
import exp from "node:constants";


describe('CartManager constructor', () => {
    it('should not load initial cart when there are not saved cart items', () => {
        const userProfile: UserProfile = {
            id: 1,
            type: UserType.Guest,
            isFirstPurchase: true,
            savedCartItems: []
        }
        const spyCartManagerLoadInitalCart = jest.spyOn(CartManager.prototype as any, 'loadInitialCart')
        const spyCartManagerLogCartInitialization = jest.spyOn(CartManager.prototype as any, 'logCartInitialization')

        new CartManager(userProfile)

        expect(spyCartManagerLoadInitalCart).not.toHaveBeenCalled()
        expect(spyCartManagerLogCartInitialization).toHaveBeenCalledWith(userProfile.id)

    })

    it('should load initial cart when there are saved cart items', () => {
        const userProfile: UserProfile = {
            id: 1,
            type: UserType.Guest,
            isFirstPurchase: true,
            savedCartItems: [{productId: 1, quantity: 10}]
        }
        const spyCartManagerLoadInitalCart = jest.spyOn(CartManager.prototype as any, 'loadInitialCart')
        const spyCartManagerLogCartInitialization = jest.spyOn(CartManager.prototype as any, 'logCartInitialization')

        const cartManager = new CartManager(userProfile)

        const arrayToBe = [{
            product: {
                id: 1,
                name: `Product 1`,
                price: 10,
                weightKg: 1
            }, quantity: 10}
        ]

        expect((cartManager as any).items).toEqual(arrayToBe)
        expect(spyCartManagerLoadInitalCart).toHaveBeenCalledWith(userProfile.savedCartItems)
        expect(spyCartManagerLogCartInitialization).toHaveBeenCalledWith(userProfile.id)
    })
})

describe('CartManager updateCart', () => {
    it("Should update quantity of existing product successfully", () => {
        const userProfile: UserProfile = {
            id: 1,
            type: UserType.Guest,
            isFirstPurchase: true,
            savedCartItems: [{productId: 1, quantity: 5}]
        }
        const cartManager = new CartManager(userProfile)
        var update = cartManager.updateCart(1, 10, null, '')
        const arrayToBe = [{
            product: {
                id: 1,
                name: `Product 1`,
                price: 10,
                weightKg: 1
            }, quantity: 10}
        ]
        expect(update).toEqual({success:true, message:'Cart updated successfully.'})
        expect((cartManager as any).items).toEqual(arrayToBe)
    })
})



