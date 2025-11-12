export interface ILogger {
    log(message: string): void;

    warn(message: string): void;
}

export class Logger implements ILogger {
  public log(message: string): void {
    console.log(message)
  }

  public warn(message: string): void {
    console.warn(message)
  }
}