import { ILogger } from './Logger'

export interface INotifier {
    sendHighValueOrderAlert(userId: number, amount: number): void
}

export class Notifier implements INotifier {
  constructor(private readonly logger: ILogger) {
  }

  sendHighValueOrderAlert(userId: number, amount: number): void {
    this.logger.log(`*** NOTIFICATION ***: User ${userId} has a high-value cart: ${amount}`)
    // Send an email to the administrator...
  }
}