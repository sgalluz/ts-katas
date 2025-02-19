import { navigate } from './MarsRover';

describe('Mars Rover', () => {
  it('No command', () => expect(navigate('')).toBe('0:0:N'))
  it('Rotate Left 1 times', () => expect(navigate('L')).toBe('0:0:W'))
  it('Rotate Right 1 times', () => expect(navigate('R')).toBe('0:0:E'))
  it('Rotate Right 2 times', () => expect(navigate('RR')).toBe('0:0:S'))
  it('Rotate Right 3 times', () => expect(navigate('RRR')).toBe('0:0:W'))
  it('Rotate Right 4 times', () => expect(navigate('RRRR')).toBe('0:0:N'))
  it('Move 1 times', () => expect(navigate('M')).toBe('0:1:N'))
  it('Move 1 times south', () => expect(navigate('RRM')).toBe('0:9:S'))
  it('Move 10 times', () => expect(navigate('MMMMMMMMMM')).toBe('0:0:N'))
  it('Move and rotate ', () => expect(navigate('MMRMMLM')).toBe('2:3:N'))
})