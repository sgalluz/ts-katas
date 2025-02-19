// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class MarsRover {
  execute(command: string): string {
    const commands = command.split("");
    const directions = "NESW";
    const roverDirection = directions[commands.length % directions.length];

    return `0:0:${roverDirection}`;
  }
}
