import { CardinalPoint, Direction, North } from './Direction';
import { Coordinate } from './Coordinate';

export class MarsRover {
  private direction: Direction = new North();
  private coordinate: Coordinate = new Coordinate(0, 0)

  execute(commands: string) {
    for (const command of commands) {
      if (command === 'R') {
        this.direction = this.direction.right();
      }
      if (command === 'L') {
        this.direction = this.direction.left();
      }
      if (command === 'M') {
        this.coordinate = this.move();
      }
    }
    return `${this.coordinate.x}:${this.coordinate.y}:${this.direction.value}`;
  }

  private move(): Coordinate {
    let y= this.coordinate.y;

    if (this.direction.value === CardinalPoint.NORTH) y += 1;

    return new Coordinate(this.coordinate.x, y);
  }
}