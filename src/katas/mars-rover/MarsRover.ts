export class MarsRover {
  private direction = 'N';

  execute(commands: string) {
    for (const command of commands) {
      if (this.direction === 'N') {
        this.direction = 'E';
      } else if (this.direction === 'E') {
        this.direction = 'S';
      } else if (this.direction === 'S') {
        this.direction = 'W';
      } else this.direction = 'N'
    }
    return `0:0:${this.direction}`;
  }
}