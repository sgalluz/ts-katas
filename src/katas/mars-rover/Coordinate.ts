export class Coordinate {
  constructor(private _x: number, private _y: number) {
  }

  get x(): number {
    return this._x
  }

  get y(): number {
    return this._y
  }

  equals(other: Coordinate): boolean {
    return this.x === other.x && this.y === other.y
  }
}