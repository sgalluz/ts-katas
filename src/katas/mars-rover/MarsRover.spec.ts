/* eslint-disable @stylistic/js/no-extra-parens */
/* eslint-disable @stylistic/js/quotes */
import { MarsRover } from "./MarsRover";

describe("Mars Rover", () => {
  let marsRover: MarsRover;

  beforeEach(() => (marsRover = new MarsRover()));

  it("works!", () => expect(marsRover).toBeTruthy());

  it("if gets mix of commands M, L, R, should return the final position", () => {
    expect(marsRover.execute("MMRMMLM")).toBe("2,3,N");
  });

  it("if gets mix of commands M, L, R, should return the final position", () => {
    expect(marsRover.execute("MMMMMMMMMM")).toBe("0,0,N");
  });
});
