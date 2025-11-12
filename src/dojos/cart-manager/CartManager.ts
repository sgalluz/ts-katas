// --- Dipendenze Esterne (Interfacce e Tipi) ---

import { ShippingService } from './ShippingService'
import { DiscountService } from './DiscountService'

/**
 * Simula un prodotto base del sistema.
 */
interface Product {
    id: number;
    name: string;
    price: number;
    weightKg: number;
}

/**
 * Tipi di utente che influenzano la logica di sconto.
 */
enum UserType {
    Guest = 'GUEST',
    Standard = 'STANDARD',
    Premium = 'PREMIUM'
}

/**
 * Il profilo utente, necessario nel costruttore.
 */
interface UserProfile {
    id: number;
    type: UserType;
    isFirstPurchase: boolean;
    // Dati caricati dal DB che complicano l'inizializzazione
    savedCartItems: { productId: number, quantity: number }[];
}


// --- La Classe Dio (Spaghetti Code V2) ---
export class CartManager {
  private items: { product: Product, quantity: number }[] = []
  private shippingAddress = ''
  private appliedCouponCode: string | null = null
  private userProfile: UserProfile // Ora dipende da un intero profilo

  /**
     * Costruttore con logica di inizializzazione che carica i dati
     * e ha side-effects (logging).
     */
  constructor(userProfile: UserProfile) {
    this.userProfile = userProfile

    // Responsabilità 6: Caricamento Stato Iniziale
    if (userProfile.savedCartItems.length > 0) {
      console.log(`Caricamento ${userProfile.savedCartItems.length} articoli salvati per utente ${userProfile.id}`)
      // Simulazione di logica complessa di merge con prodotti attuali in memoria
      this.loadInitialCart(userProfile.savedCartItems)
    }

    // Side effect/Inizializzazione implicita che rende difficile l'istanziamento
    this.logCartInitialization(userProfile.id)
  }

  /**
     * Metodo privato di helper che complica il test del costruttore.
     * Simula il recupero e la validazione di dati.
     */
  private loadInitialCart(savedItems: { productId: number, quantity: number }[]) {
    savedItems.forEach(item => {
      // Simula il recupero del prodotto dal DB (un'altra dipendenza nascosta!)
      const product: Product = {
        id: item.productId,
        name: `Prodotto ${item.productId}`,
        price: item.productId * 10,
        weightKg: 1
      }
      this.items.push({ product, quantity: item.quantity })
    })
  }

  /**
     * Side effect nel costruttore.
     */
  private logCartInitialization(userId: number): void {
    // Simula la scrittura su un log file esterno
    console.log(`[LOGGING] Carrello inizializzato per utente: ${userId}.`)
  }

  /**
     * Metodo enorme che fa troppe cose (CRUD + Business Logic)
     */
  public updateCart(
    productId: number,
    quantity: number,
    couponCode: string | null = null,
    address = ''
  ): { success: boolean, message: string } {

    // 1. Gestione del Carrello (Responsabilità 1)
    // Simula il recupero del prodotto (in V2, questo è ancora peggio)
    const product: Product = { id: productId, name: `Prodotto ${productId}`, price: productId * 10, weightKg: 1 }
    const existingItem = this.items.find(item => item.product.id === productId)

    if (quantity <= 0) {
      if (existingItem) {
        this.items = this.items.filter(item => item.product.id !== productId)
      }
      return { success: true, message: 'Articolo rimosso o quantità zero ignorata.' }
    }

    if (existingItem) {
      existingItem.quantity = quantity
    } else {
      this.items.push({ product, quantity })
    }

    // 2. Aggiornamento Stili di Vita (Side effects impliciti)
    this.appliedCouponCode = couponCode
    this.shippingAddress = address

    // 3. Controllo Logica (Responsabilità 2: Validazione)
    if (this.userProfile.id === 999 && product.price > 100) { // Usa this.userProfile.id
      return { success: false, message: 'L\'utente VIP 999 non può acquistare articoli costosi direttamente.' }
    }

    return { success: true, message: 'Carrello aggiornato con successo.' }
  }

  /**
     * Metodo enorme che calcola tutto (Responsabilità 3, 4, 5, 7, 8)
     */
  public getFinalSummary(): { total: number, discount: number, shippingCost: number, finalTotal: number } {

    const subtotal = this.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    const totalWeight = this.items.reduce((acc, item) => acc + item.product.weightKg * item.quantity, 0)
    let discount = 0
    let shippingCost = 0

    // 3. Calcolo Sconto: L'interazione è più complessa (dipendenza da userProfile.type)
    if (this.appliedCouponCode) {
      const discountValue = DiscountService.validateCoupon(
        this.appliedCouponCode,
        subtotal,
        this.userProfile.type
      )

      if (discountValue !== null) {
        discount = discountValue
      }
    }

    // Aggiunta: Sconto First Purchase (Responsabilità 7)
    if (this.userProfile.isFirstPurchase && this.userProfile.type === UserType.Standard) {
      discount += subtotal * 0.10 // BUG: Si somma al coupon
    }

    const totalAfterDiscount = subtotal - discount

    // 4. Calcolo Spedizione (Responsabilità 4)
    if (totalAfterDiscount < 50 && this.shippingAddress) {
      shippingCost = ShippingService.calculate(this.shippingAddress, totalWeight)
    } else if (this.appliedCouponCode === 'FREE_SHIPPING' || totalAfterDiscount >= 100) {
      shippingCost = 0
    } else {
      shippingCost = 15 // Costo base
    }

    // Aggiunta: Logica di validazione finanziaria (Responsabilità 8)
    if (this.userProfile.type === UserType.Guest && subtotal > 200) {
      console.warn('Transazione ospite superiore al limite. Applica fee extra.')
      shippingCost += 10
    }

    const finalTotal = totalAfterDiscount + shippingCost

    // 5. Notifica/side-effect (Responsabilità 5)
    if (finalTotal > 500 && this.items.length > 5) {
      this.sendHighValueOrderAlert(finalTotal)
    }

    return {
      total: subtotal,
      discount: discount,
      shippingCost: shippingCost,
      finalTotal: finalTotal
    }
  }

  /**
     * Altro side effect privato.
     */
  private sendHighValueOrderAlert(amount: number): void {
    console.log(`*** NOTIFICA ***: L'utente ${this.userProfile.id} ha un carrello di valore elevato: ${amount}`)
    // Invia una email all'amministratore...
  }
}