/**
 * Simulates a basic product of the system.
 */
export interface Product {
    id: number;
    name: string;
    price: number;
    weightKg: number;
}

export function buildProduct(id: number): Product {
  return { id: id, name: `Product ${id}`, price: id * 10, weightKg: 1 }
}
