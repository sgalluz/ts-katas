import { rotate } from './Rotation';
import { move } from './Movement';

export type Position = [number, number]

export type Orientation = 'N' | 'E' | 'S' | 'W'

export type Command = 'R' | 'L' | 'M'

export type Transformation = (state: State) => State

export interface State {
    position: Position
    orientation: Orientation
}
export function navigate(commands: string): string {
  const initialState : State = { position: [0, 0], orientation: 'N' }
  const commandList: Command[] = commands.split('') as Command[]
  const state = commandList.reduce((acc, curr) => executors[curr](acc), initialState)
  return printState(state)
}

function printState(state: State): string {
  return `${state.position[0]}:${state.position[1]}:${state.orientation}`
}

const executors: Record<Command, Transformation> = {
  'R' : (state: State ) => rotate( state, 'R'),
  'L' : (state: State ) => rotate( state, 'L'),
  'M' : (state: State ) => move( state )
}
