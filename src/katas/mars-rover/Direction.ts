export enum CardinalPoint {
    NORTH = 'N',
    EAST = 'E',
    SOUTH = 'S',
    WEST = 'W'
}

export interface Direction {
    readonly value: CardinalPoint;

    right(): Direction;

    left(): Direction;
}

export class North implements Direction {
  readonly value = CardinalPoint.NORTH
  right = (): Direction => new East()
  left = (): Direction => new West()
}

export class East implements Direction {
  readonly value = CardinalPoint.EAST
  right = (): Direction => new South()
  left = (): Direction => new North()
}

export class South implements Direction {
  readonly value = CardinalPoint.SOUTH
  right = (): Direction => new West()
  left = (): Direction => new East()
}

export class West implements Direction {
  readonly value = CardinalPoint.WEST
  left = (): Direction => new South()
  right = (): Direction => new North()
}

export function directionFrom(cardinalPoint: CardinalPoint): Direction {
  switch (cardinalPoint) {
  case CardinalPoint.NORTH:
    return new North()
  case CardinalPoint.SOUTH:
    return new South()
  case CardinalPoint.EAST:
    return new East()
  case CardinalPoint.WEST:
    return new West()
  }
}