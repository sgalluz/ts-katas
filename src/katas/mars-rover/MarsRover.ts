import { Direction, North } from './Direction';

export class MarsRover {
  private direction: Direction = new North();
  private x = 0;
  private y = 0;

  execute(commands: string) {
    for (const command of commands) {
      if (command === 'R') {
        this.direction = this.direction.right();
      }
      if (command === 'L') {
        this.direction = this.direction.left();
      }
      if (command === 'M') {
        this.y += 1
      }
    }
    return `${this.x}:${this.y}:${this.direction.value}`;
  }
}