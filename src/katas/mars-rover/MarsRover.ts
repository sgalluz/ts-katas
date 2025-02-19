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

const MOVEMENTS = {
  N: [0, 1],
  S: [0, -1],
  W: [-1, 0],
  E: [1, 0],
};

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
        case Command.MOVE:
          this.coordinate = this.move();
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

  private move() {
    let x = this.coordinate.x;
    let y = this.coordinate.y;

    const movement = MOVEMENTS[this.direction];

    if (x + movement[0] < 0) {
      x = 9;
    } else {
      x = x + movement[0];
    }

    if (y + movement[1] < 0) {
      y = 9;
    } else {
      y = y + movement[1];
    }

    return { x, y };
  }
}
