import { UserProfile, UserType } from '../models/UserProfile'

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

  withType(type: UserType): this {
    this.profile.type = type
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

export const aUser = () => new UserProfileBuilder()