import { MarsRover } from './MarsRover';

describe('Mars Rover', () => {
  let marsRover: MarsRover;

  beforeEach(() => marsRover = new MarsRover())

  it.each([
    ['R', '0:0:E'],
    ['RR', '0:0:S'],
    ['RRR', '0:0:W'],
    ['RRRR', '0:0:N']
  ])('should rotate right', (commands, position) => {
    expect(marsRover.execute(commands)).toEqual(position);
  })

  it.each([
    ['L', '0:0:W'],
    ['LL', '0:0:S'],
    ['LLL', '0:0:E'],
    ['LLLL', '0:0:N']
  ])('should rotate left', (commands, position) => {
    expect(marsRover.execute(commands)).toEqual(position);
  })

  it.each([
    ['M', '0:1:N'],
  ])('should move up', (commands, position) => {
    expect(marsRover.execute(commands)).toEqual(position);
  })
})