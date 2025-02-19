/* eslint-disable @stylistic/js/no-extra-parens */
/* eslint-disable @stylistic/js/quotes */
import { MarsRover } from "./MarsRover";

describe("Mars Rover", () => {
  let marsRover: MarsRover;

  beforeEach(() => (marsRover = new MarsRover()));

  it("works!", () => expect(marsRover).toBeTruthy());

  it("given a grid with no obstacles, input MMRMMLM gives output 2:3:N", () => {
    expect(marsRover.execute("MMRMMLM")).toBe("2:3:N");
  });

  it("given a grid with no obstacles, input MMMMMMMMMM gives output 0:0:N (due to wrap-around)", () => {
    expect(marsRover.execute("MMMMMMMMMM")).toBe("0:0:N");
  });

  it("given a grid with an obstacle at (0, 3), input MMMM gives output O:0:2:N", () => {
    marsRover.grid.obstacles = [{ x: 0, y: 3 }];
    expect(marsRover.execute("MMMM")).toBe("O:0:2:N");
  });
});
