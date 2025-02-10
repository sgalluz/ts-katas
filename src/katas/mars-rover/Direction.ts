export interface Direction {
    readonly value: string;
    right(): Direction;
    left(): Direction;
}

export class North implements Direction {
  readonly value = 'N';
  right = (): Direction => new East();
  left = (): Direction => new West();
}

export class East implements Direction {
  readonly value: string = 'E';
  right = (): Direction => new South();
  left = (): Direction => new North();
}

export class South implements Direction {
  readonly value: string = 'S';
  right = (): Direction => new West();
  left = (): Direction => new East();
}

export class West implements Direction {
  readonly value: string = 'W';
  left = (): Direction => new South();
  right = (): Direction => new North();
}