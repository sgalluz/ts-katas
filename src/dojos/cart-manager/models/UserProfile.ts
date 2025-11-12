/**
 * User types that affect discount logic.
 */
export enum UserType {
    Guest = 'GUEST',
    Standard = 'STANDARD',
    Premium = 'PREMIUM'
}

/**
 * The user profile, required in the constructor.
 */
export interface UserProfile {
    id: number;
    type: UserType;
    isFirstPurchase: boolean;
    // Data loaded from DB that complicates initialization
    savedCartItems: { productId: number, quantity: number }[];
}