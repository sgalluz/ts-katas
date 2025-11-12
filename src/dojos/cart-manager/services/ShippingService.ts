export interface IShippingService {
    calculate(address: string, totalWeight: number): number;
}

export class ShippingServiceV2 implements IShippingService {
  public calculate(address: string, totalWeight: number): number {
    return ShippingService.calculate(address, totalWeight)
  }
}

/**
 * Simulates a SLOW external service for shipping.
 * Static method = tight coupling.
 * Makes mocking in tests more difficult.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ShippingService {
  public static calculate(address: string, totalWeight: number): number {
    console.log(`[EXTERNAL] Calculating shipping for ${address}...`)
    // Complex and slow logic...
    if (totalWeight > 10) return 50
    if (address.includes('Island')) return 30
    return 10
  }
}