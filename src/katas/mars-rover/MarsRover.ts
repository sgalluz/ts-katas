
export type Position = [number, number]

export type Orientation = 'N' | 'E' | 'S' | 'W'

export type Command = 'R' | 'L' | 'M'



export interface State {
    position: Position
    orientation: Orientation
}

export type Transformation = (state: State) => State
export function navigate(commands: string): string {
  const initialState : State = { position: [0, 0], orientation: 'N' }
  const commandList: Command[] = commands.split('') as Command[]
  const state = commandList.reduce((acc, curr) => executors[curr](acc), initialState)
  return printState(state)
}

function printState(state: State): string {
  return `${state.position[0]}:${state.position[1]}:${state.orientation}`
}


function rotate(state: State, direction: Command): State {
  const orientations : Orientation[] = ['N', 'E', 'S', 'W']
  const currentIndex = orientations.indexOf(state.orientation)
  const nextIndex = direction === 'R' ? (currentIndex + 1) % 4 : (currentIndex + 3) % 4
  return { ...state, orientation: orientations[nextIndex] }
}

function move(state: State): State {
  const [x, y] = state.position
  switch (state.orientation) {
  case 'N':
    return { ...state, position: [x, moveCursor(y, 'forward')] }
  case 'E':
    return { ...state, position: [moveCursor(x, 'forward'), y] }
  case 'S':
    return { ...state, position: [x, moveCursor(y, 'backward')] }
  case 'W':
    return { ...state, position: [ moveCursor(x, 'backward'), y] }
  }
}

function moveCursor (x: number, sh: string){
  if (sh === 'forward') {
    return (x + 1) % 10
  } else {
    if (x === 0) {
      return 9
    } else {
      return x - 1
    }
  }
}

const executors: Record<Command, Transformation> = {
  'R' : (state: State ) => rotate( state, 'R'),
  'L' : (state: State ) => rotate( state, 'L'),
  'M' : (state: State ) => move( state )
}
