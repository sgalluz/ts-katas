import { Direction, North } from './Direction';

export class MarsRover {
  private direction: Direction = new North();

  execute(commands: string) {
    for (const command of commands) {
      if (command === 'R') {
        this.direction = this.direction.right();
      }
      if (command === 'L') {
        this.direction = this.direction.left();
      }
    }
    return `0:0:${this.direction.value}`;
  }
}