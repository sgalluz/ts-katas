import { Direction, North } from './Direction';
import { Coordinate } from './Coordinate';
import { Grid } from './Grid';

export class MarsRover {
  constructor(private grid: Grid) {
  }

  private direction: Direction = new North();
  private coordinate: Coordinate = new Coordinate(0, 0)

  execute(commands: string) {
    let hasObstacle = false
    for (const command of commands) {
      if (command === 'R') {
        this.direction = this.direction.right();
      }
      if (command === 'L') {
        this.direction = this.direction.left();
      }
      if (command === 'M') {
        const coordinate = this.grid.moveToNextCoordinateFrom(this.coordinate, this.direction.value);
        if (!coordinate) {
          hasObstacle = true;
        } else {
          hasObstacle = false;
          this.coordinate = coordinate;
        }
      }
    }
    return (hasObstacle ? 'O:' : '') + `${this.coordinate.x}:${this.coordinate.y}:${this.direction.value}`;
  }
}