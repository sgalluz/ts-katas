import { MarsRover } from './MarsRover';

describe('Mars Rover', () => {
  let marsRover: MarsRover;

  beforeEach(() => marsRover = new MarsRover())

  it('should rotate right', () => {
    expect(marsRover.execute('R')).toEqual('0:0:E');
  })
})