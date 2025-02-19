/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @stylistic/js/quotes */
/* eslint-disable @stylistic/js/indent */

enum Direction {
  N = "N",
  E = "E",
  S = "S",
  W = "W",
}

class MarsRover {
  x: number = 0;
  y: number = 0;
  direction: Direction = Direction.N;
  grid: Grid;

  constructor(grid: Grid = new Grid()) {
    this.grid = grid;
  }

  execute = (command: string): string => {
    const commands: string[] = command.split("");
    commands.forEach((command) => {
      switch (command) {
        case "L":
          this.turnLeft();
          break;
        case "R":
          this.turnRight();
          break;
        case "M":
          this.moveForward();
          break;
      }
    });
    return `${this.x},${this.y},${this.direction}`;
  };

  turnLeft = (): void => {
    switch (this.direction) {
      case Direction.N:
        this.direction = Direction.W;
        break;
      case Direction.E:
        this.direction = Direction.N;
        break;
      case Direction.S:
        this.direction = Direction.E;
        break;
      case Direction.W:
        this.direction = Direction.S;
        break;
    }
  };

  turnRight = (): void => {
    switch (this.direction) {
      case Direction.N:
        this.direction = Direction.E;
        break;
      case Direction.E:
        this.direction = Direction.S;
        break;
      case Direction.S:
        this.direction = Direction.W;
        break;
      case Direction.W:
        this.direction = Direction.N;
        break;
    }
  };

  moveForward = (): void => {
    switch (this.direction) {
      case Direction.N:
        if (this.y < this.grid.y - 1) {
          this.y++;
        } else {
          this.y = 0;
        }
        break;
      case Direction.E:
        if (this.x < this.grid.x - 1) {
          this.x++;
        } else {
          this.x = 0;
        }
        break;
      case Direction.S:
        if (this.y > 0) {
          this.y--;
        } else {
          this.y = this.grid.y;
        }
        break;
      case Direction.W:
        if (this.x > 0) {
          this.x--;
        } else {
          this.x = this.grid.x;
        }
        break;
    }
  };
}

class Grid {
  x: number;
  y: number;

  constructor(x: number = 10, y: number = 10) {
    this.x = x;
    this.y = y;
  }
}

export { MarsRover, Direction, Grid };
