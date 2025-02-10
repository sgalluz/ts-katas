import { Direction, North } from './Direction';
import { Coordinate } from './Coordinate';
import { Grid } from './Grid';

export class MarsRover {
  constructor(private grid: Grid) {
  }

  private direction: Direction = new North();
  private coordinate: Coordinate = new Coordinate(0, 0)

  execute(commands: string): string {
    let hasObstacle = false
    for (const command of commands) {
      if (command === 'R') {
        this.direction = this.direction.right();
      }
      if (command === 'L') {
        this.direction = this.direction.left();
      }
      if (command === 'M') {
        hasObstacle = this.move();
      }
    }

    const obstaclePrefix = hasObstacle ? 'O:' : '';
    return `${obstaclePrefix}${this.coordinate.x}:${this.coordinate.y}:${this.direction.value}`;
  }

  private move(): boolean {
    const coordinate = this.grid.moveToNextCoordinateFrom(this.coordinate, this.direction.value);
    this.coordinate = coordinate ?? this.coordinate;
    return !coordinate || false;
  }
}