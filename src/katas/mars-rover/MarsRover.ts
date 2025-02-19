// eslint-disable-next-line @typescript-eslint/no-extraneous-class
enum RoverDirection {
  N = "N",
  E = "E",
  S = "S",
  W = "W",
}

enum Command {
  RIGHT = "R",
  LEFT = "L",
  MOVE = "M",
}

export class MarsRover {
  static readonly clockWiseDirections = "NESW";
  static readonly counterClockWiseDirections = "NWSE";

  private direction: RoverDirection = RoverDirection.N;
  private coordinate = { x: 0, y: 0 };

  execute(commands: string): string {
    // let roverDirection = directions[commands.length % directions.length];
    for (const command of commands) {
      switch (command) {
        case Command.RIGHT:
          this.direction = this.rotateRight();
          break;
        case Command.LEFT:
          this.direction = this.rotateLeft();
          break;
        default:
      }
    }

    return `${this.coordinate.x}:${this.coordinate.y}:${this.direction}`;
  }

  private rotateRight() {
    return MarsRover.clockWiseDirections[
      (MarsRover.clockWiseDirections.indexOf(this.direction) + 1) %
        MarsRover.clockWiseDirections.length
    ] as RoverDirection;
  }

  private rotateLeft() {
    return MarsRover.counterClockWiseDirections[
      (MarsRover.counterClockWiseDirections.indexOf(this.direction) + 1) %
        MarsRover.counterClockWiseDirections.length
    ] as RoverDirection;
  }
}
