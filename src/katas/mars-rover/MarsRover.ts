export class MarsRover {
  private direction = 'N';

  execute(commands: string) {
    for (const command of commands) {
      if (command === 'R') {
        this.direction = this.rotateRight();
      }
      if (command === 'L') {
        this.direction = this.rotateLeft();
      }
    }
    return `0:0:${this.direction}`;
  }

  private rotateRight(): string {
    if (this.direction === 'N') return 'E';
    if (this.direction === 'E') return 'S';
    if (this.direction === 'S') return 'W';
    return 'N'
  }

  private rotateLeft() {
    return 'W';
  }
}