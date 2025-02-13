import { CardinalPoint, Direction, directionFrom, North } from './Direction';
import { Coordinate } from './Coordinate';
import { Grid } from './Grid';
import { Command, Move, RotateLeft, RotateRight } from './Command';

export class MarsRover {
  private direction: Direction = new North();
  private coordinate: Coordinate = new Coordinate(0, 0)
  private commands: Record<string, Command>;

  constructor(private grid: Grid) {
    this.commands = this.registerCommands()
  }

  execute(commands: string): string {
    let output = `${this.coordinate.x}:${this.coordinate.y}:${this.direction.value}`;
    for (const command of commands) {
      output = this.commands[command].execute(this.direction, this.coordinate);
      this.parseOutput(output)
    }
    return output;
  }

  private registerCommands(): Record<string, Command> {
    return {
      R: new RotateRight(),
      L: new RotateLeft(),
      M: new Move(this.grid)
    }
  }

  private parseOutput(output: string) {
    const [x, y, cardinalPoint] = output.split(':').filter(x => x !== 'O');
    this.coordinate = new Coordinate(parseInt(x), parseInt(y));
    this.direction = directionFrom(cardinalPoint as CardinalPoint);
  }
}