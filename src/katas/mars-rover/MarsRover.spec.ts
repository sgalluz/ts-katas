import { MarsRover } from "./MarsRover";

describe("Mars Rover", () => {
  let marsRover: MarsRover;

  beforeEach(() => (marsRover = new MarsRover()));

  describe("Commands", () => {
    it.each([
      ["R", "0:0:E"],
      ["RR", "0:0:S"],
      ["RRR", "0:0:W"],
      ["RRRR", "0:0:N"],
    ])("turn right", (command, expectation) => {
      expect(marsRover.execute(command)).toEqual(expectation);
    });

    it.each([
      ["L", "0:0:W"],
      ["LL", "0:0:S"],
      ["LLL", "0:0:E"],
      ["LLLL", "0:0:N"],
    ])("turn left", (command, expectation) => {
      expect(marsRover.execute(command)).toEqual(expectation);
    });

    it.each([
      ["M", "0:1:N"],
      ["MM", "0:2:N"],
      ["RM", "1:0:E"],
      ["RMM", "2:0:E"],
      ["LM", "9:0:W"],
      ["LMM", "8:0:W"],
      ["LLM", "0:9:S"],
      ["RRM", "0:9:S"],
    ])("moves", (command, expectation) => {
      expect(marsRover.execute(command)).toEqual(expectation);
    });
  });
});

// Examples
// given a grid with no obstacles, input MMRMMLM gives output 2:3:N
// given a grid with no obstacles, input MMMMMMMMMM gives output 0:0:N (due to wrap-around)
// given a grid with an obstacle at (0, 3), input MMMM gives output O:0:2:N

// Rules
// You are given the initial starting point (0,0,N) of a rover.
// 0,0 are X,Y co-ordinates on a grid of (10,10).
// N is the direction it is facing (i.e. N,S,E,W).
// L and R allow the rover to rotate left and right.
// M allows the rover to move one point in the current direction.
// The rover receives a char array of commands e.g. RMMLM and returns the finishing point after the moves e.g. 2,1,N
// The rover wraps around if it reaches the end of the grid.
// The grid may have obstacles. If a given sequence of commands encounters an obstacle, the rover moves up to the last possible point and reports the obstacle e.g. O,2,2,N
