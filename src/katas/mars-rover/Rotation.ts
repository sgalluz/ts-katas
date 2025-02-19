import { Command, Orientation, State } from './MarsRover';

export  function rotate(state: State, direction: Command): State {
  const orientations : Orientation[] = ['N', 'E', 'S', 'W']
  const currentIndex = orientations.indexOf(state.orientation)
  const nextIndex = direction === 'R' ? (currentIndex + 1) % 4 : (currentIndex + 3) % 4
  return { ...state, orientation: orientations[nextIndex] }
}