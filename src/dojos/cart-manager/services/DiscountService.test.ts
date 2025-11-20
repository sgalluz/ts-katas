import { UserType } from "../models/UserProfile";
import { DiscountService } from "./DiscountService";

describe('discountService', () => {
    it('should apply no discount due to wrong code', () => {
       
        const discountValue = DiscountService.validateCoupon(
                'TS_DOJO_2000',
                100,
                UserType.Guest
              );
              
        expect(discountValue).toBe(0);
    })

    it('should apply 20 discount', () => {
       
        const discountValue = DiscountService.validateCoupon(
                'TS_DOJO_20',
                100,
                UserType.Guest
              );
              
        expect(discountValue).toBe(20);
    })

     it('should apply 50 discount', () => {
       
        const discountValue = DiscountService.validateCoupon(
                'PREMIUM_50',
                100,
                UserType.Premium
              );
              
        expect(discountValue).toBe(50);
    })

    it('should apply 0 discount due to wrong user/code', () => {
       
        const discountValue = DiscountService.validateCoupon(
                'PREMIUM_50',
                100,
                UserType.Standard
              );
              
        expect(discountValue).toBe(0);
    })
})