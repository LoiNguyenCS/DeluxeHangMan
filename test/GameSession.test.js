const GameSession = require('../component/GameSession')

describe('GameSession', () => {
  let game

  beforeEach(() => {
    game = new GameSession('HELLO', 6)
  })

  test('correctly initializes properties', () => {
    expect(game.word).toBe('HELLO')
    expect(game.maxAttempts).toBe(6)
    expect(game.listOfPlayers).toEqual([])
    expect(game.attemptsLeft).toBe(6)
    expect(game.guessedLetters.size).toBe(0)
    expect(game.status).toBe('IN_PROGRESS')
  })

  test('addPlayer adds player to list of players', () => {
    game.addPlayer('player1')
    expect(game.listOfPlayers).toContain('player1')
  })

  test('remaining attempts number not affected for correct guesses', () => {
    game.guess('H')
    expect(game.guessedLetters.has('H')).toBe(true)
    expect(game.attemptsLeft).toBe(6)
    expect(game.status).toBe('IN_PROGRESS')
  })

  test('remaining attempts number decreased for incorrect guesses', () => {
    game.guess('Z')
    expect(game.guessedLetters.has('Z')).toBe(true)
    expect(game.attemptsLeft).toBe(5)
    expect(game.status).toBe('IN_PROGRESS')
  })

  test('guess correctly guesses the whole letter', () => {
    game.guess('H')
    game.guess('E')
    game.guess('L')
    game.guess('O')
    expect(game.isWordGuessed()).toBe(true)
    expect(game.status).toBe('WIN')
  })

  test('runs out of attempts', () => {
    game.guess('Z')
    game.guess('Y')
    game.guess('X')
    game.guess('W')
    game.guess('V')
    game.guess('U')
    expect(game.isWordGuessed()).toBe(false)
    expect(game.status).toBe('LOSE')
  })
})
