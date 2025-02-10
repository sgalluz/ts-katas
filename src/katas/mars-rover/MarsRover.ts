import { CardinalPoint, Direction, North } from './Direction';
import { Coordinate } from './Coordinate';

export class MarsRover {
  private static readonly GRID_HEIGHT = 10;

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
    let y= this.coordinate.y,
      x = this.coordinate.x;

    const direction = this.direction.value;
    if (direction === CardinalPoint.NORTH) y = (y + 1) % MarsRover.GRID_HEIGHT;
    if (direction === CardinalPoint.EAST) x += 1;

    return new Coordinate(x, y);
  }
}