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
  obstacleFound: boolean = false;

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
    return this.obstacleFound
      ? `O:${this.x}:${this.y}:${this.direction}`
      : `${this.x}:${this.y}:${this.direction}`;
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
    let temp_x: number;
    let temp_y: number;
    switch (this.direction) {
      case Direction.N:
        if (this.y < this.grid.y - 1) {
          temp_y = this.y + 1;
        } else {
          temp_y = 0;
        }
        if (this.grid.hasObstacle(this.x, temp_y)) {
          this.obstacleFound = true;
          break;
        }
        this.y = temp_y;
        break;
      case Direction.E:
        if (this.x < this.grid.x - 1) {
          temp_x = this.x + 1;
        } else {
          temp_x = 0;
        }
        if (this.grid.hasObstacle(temp_x, this.y)) {
          this.obstacleFound = true;
          break;
        }
        this.x = temp_x;
        break;
      case Direction.S:
        if (this.y > 0) {
          temp_y = this.y - 1;
        } else {
          temp_y = this.grid.y;
        }
        if (this.grid.hasObstacle(this.x, temp_y)) {
          this.obstacleFound = true;
          break;
        }
        this.y = temp_y;
        break;
      case Direction.W:
        if (this.x > 0) {
          temp_x = this.x - 1;
        } else {
          temp_x = this.grid.x;
        }
        if (this.grid.hasObstacle(temp_x, this.y)) {
          this.obstacleFound = true;
          break;
        }
        this.x = temp_x;
        break;
    }
  };
}

interface Obstacle {
  x: number;
  y: number;
}

class Grid {
  x: number;
  y: number;
  obstacles: Obstacle[] = [];

  constructor(x: number = 10, y: number = 10, obstacles: Obstacle[] = []) {
    this.x = x;
    this.y = y;
    this.obstacles = obstacles;
  }

  hasObstacle = (x: number, y: number): boolean => {
    return this.obstacles.find((o) => o.x === x && o.y === y) !== undefined;
  };
}

export { MarsRover, Direction, Grid };
