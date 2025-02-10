import { MarsRover } from './MarsRover';
import { Grid } from './Grid';
import { Coordinate } from './Coordinate';

describe('Mars Rover', () => {
  let marsRover: MarsRover;

  beforeEach(() => marsRover = new MarsRover(new Grid()))

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
    ['MMMM', '0:4:N']
  ])('should move up', (commands, position) => {
    expect(marsRover.execute(commands)).toEqual(position);
  })

  it.each([
    ['MMMMMMMMMM', '0:0:N'],
    ['MMMMMMMMMMMMMMM', '0:5:N']
  ])('should wrap around and reappear at the bottom when moving to north', (commands, position) => {
    expect(marsRover.execute(commands)).toEqual(position);
  })

  it.each([
    ['RM', '1:0:E'],
    ['RMMMM', '4:0:E']
  ])('should move right', (commands, position) => {
    expect(marsRover.execute(commands)).toEqual(position);
  })

  it.each([
    ['RMMMMMMMMMM', '0:0:E'],
    ['RMMMMMMMMMMMMM', '3:0:E']
  ])('should wrap around and reappear on the left side when moving to east', (commands, position) => {
    expect(marsRover.execute(commands)).toEqual(position);
  })

  it.each([
    ['LM', '9:0:W'],
    ['LMMMM', '6:0:W']
  ])('should move left', (commands, position) => {
    expect(marsRover.execute(commands)).toEqual(position);
  })

  it.each([
    ['LLM', '0:9:S'],
    ['LLMMMMMM', '0:4:S']
  ])('should move down', (commands, position) => {
    expect(marsRover.execute(commands)).toEqual(position);
  })

  it.each([
    ['MMM', 'O:0:2:N'],
    ['RMMMRMMMM', 'O:3:8:S']
  ])('should stay still when encountering an obstacle', (commands, position) => {
    const obstacles = [new Coordinate(0, 3), new Coordinate(3, 7)];
    const grid = new Grid(obstacles);
    marsRover = new MarsRover(grid)
    expect(marsRover.execute(commands)).toEqual(position);
  })
})