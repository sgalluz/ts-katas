import { Direction } from './Direction'
import { Coordinate } from './Coordinate'
import { Grid } from './Grid'

export interface Command {
    execute(direction: Direction, coordinate: Coordinate): string;
}

export class RotateRight implements Command {
  execute(direction: Direction, coordinate: Coordinate): string {
    return coordinate.x + ':' + coordinate.y + ':' + direction.right().value
  }
}

export class RotateLeft implements Command {
  execute(direction: Direction, coordinate: Coordinate): string {
    return coordinate.x + ':' + coordinate.y + ':' + direction.left().value
  }
}

export class Move implements Command {
  constructor(readonly grid: Grid) {
  }

  execute(direction: Direction, coordinate: Coordinate): string {
    const newCoordinate = this.grid.moveToNextCoordinateFrom(coordinate, direction.value)
    const hasObstacle = !newCoordinate || false
    const obstaclePrefix = hasObstacle ? 'O:' : ''
    const { x, y } = hasObstacle ? coordinate : newCoordinate
    return `${obstaclePrefix}${x}:${y}:${direction.value}`
  }
}