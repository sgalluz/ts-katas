import { MarsRover } from './MarsRover';

describe('Mars Rover', () => {
  let marsRover: MarsRover;

  beforeEach(() => marsRover = new MarsRover())

  it.each([
    ['R', '0:0:E'],
    ['RR', '0:0:S'],
    ['RRR', '0:0:W'],
    ['RRRR', '0:0:N']
  ])('should rotate right', (commands, output) => {
    expect(marsRover.execute(commands)).toEqual(output);
  })

  it.each([
    ['L', '0:0:W'],
  ])('should rotate left', (commands, output) => {
    expect(marsRover.execute(commands)).toEqual(output);
  })
})