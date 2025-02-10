import { Coordinate } from './Coordinate';
import { CardinalPoint } from './Direction';

export class Grid {
  constructor(private obstacles: Coordinate[] = []) {
  }

  private static readonly HEIGHT = 10;
  private static readonly WIDTH = 10;

  public moveToNextCoordinateFrom(coordinate: Coordinate, direction: CardinalPoint): Coordinate | null {
    let y = coordinate.y,
      x = coordinate.x;

    if (direction === CardinalPoint.NORTH) y = (y + 1) % Grid.HEIGHT;
    if (direction === CardinalPoint.EAST) x = (x + 1) % Grid.WIDTH;
    if (direction === CardinalPoint.SOUTH) y = (y > 0 ? y : Grid.HEIGHT) - 1;
    if (direction === CardinalPoint.WEST) x = (x > 0 ? x : Grid.WIDTH) - 1;

    const newCoordinate = new Coordinate(x, y);
    return this.obstacles.some(c => c.equals(newCoordinate)) ? null : newCoordinate;
  }
}