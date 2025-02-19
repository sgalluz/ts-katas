import { State } from './MarsRover';

export function move(state: State): State {
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
