export class MarsRover {
  private direction = 'N';

  execute(commands: string) {
    for (const command of commands) {
      this.direction = this.rotateRight();
    }
    return `0:0:${this.direction}`;
  }

  private rotateRight(): string {
    if (this.direction === 'N') return 'E';
    if (this.direction === 'E') return 'S';
    if (this.direction === 'S') return 'W';
    return 'N'
  }
}