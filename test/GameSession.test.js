const GameSession = require('../component/GameSession')

describe('GameSession', () => {
  let game

  beforeEach(() => {
    game = new GameSession()
  })

  describe('addPlayer', () => {
    game = new GameSession()

    it('Adds Player to players list', () => {
      game.addPlayer('Gabe', '123')
      expect(game.listOfPlayers.peek()).toBe('Gabe')
    })
    it('creates dictionary entry relating id to player name', () => {
      game.addPlayer('Gabe', '123')
      expect(game.idToName['123']).toBe('Gabe')
    })
    it('sets game state to wait when first player joins', () => {
      game.addPlayer('Gabe', '123')
      expect(game.status).toBe('Wait')
    })
    it('keeps game state same even when more players join', () => {
      game.addPlayer('Henry', '532')
      let originalState = game.status
      game.addPlayer('Gabe', '123')
      expect(game.status).toBe(originalState)
    })
  })
  describe('PickWord', () => {
    game = new GameSession()

    it('Picks a word for the game', () => {
      expect(game.fullWord).toBe('')
      game.PickWord()
      expect(game.fullWord).not.toBe('')
    })
  })
  describe('SetTimer', () => {
    game = new GameSession()

    it('Sets timer to plus one of what was entered', () => {
      game.SetTimer(70)
      expect(game.Seconds).toBe(71)
    })
  })
  describe('HideWord', () => {
    game = new GameSession()

    it('Hides the word entered in and returns it', () => {
      let word = game.HideWord('TE st')
      expect(word).toBe('__ __')
    })
  })
  describe('UpdateHang', () => {
    game = new GameSession()

    it('increments hang value by 1', () => {
      game.UpdateHang()
      expect(game.hang).toBe(1)
    })
    it('increments gives correct hang image', () => {
      game.UpdateHang()
      expect(game.hangImage).toBe('hang1.png')
    })
    it('when hang reaches 7 misses, set state to Lose', () => {
      game.hang = 6
      game.UpdateHang()
      expect(game.status).toBe('Lose')
    })
  })
  describe('UpdateWord', () => {
    game = new GameSession()

    it('Reveals letter of a word', () => {
      game.fullWord = 'ABC'
      game.word = '_BC'
      game.UpdateWord('A')
      expect(game.word).toBe('ABC')
    })
    it('Does not reveal any other letters', () => {
      game.fullWord = 'ABC'
      game.word = '_B_'
      game.UpdateWord('A')
      expect(game.word).toBe('AB_')
    })
    it('Adds guessed letter to guessed list', () => {
      game.UpdateWord('B')
      expect(game.guessedLetters[0]).toBe('B')
    })
  })
  describe('SwitchPlayer', () => {
    game = new GameSession()

    it('Switches active player to next player on queue', () => {
      game.addPlayer('Gabe', '123')
      game.addPlayer('Henry', '456')
      game.SwitchPlayer()
      expect(game.ActivePlayer).toBe('Gabe')
      game.SwitchPlayer()
      expect(game.ActivePlayer).toBe('Henry')
      game.SwitchPlayer()
      expect(game.ActivePlayer).toBe('Gabe')
    })
  })
  describe('UpdateHeader', () => {
    game = new GameSession()

    it('Changes current header to the new given one', () => {
      let message = 'Test Message'
      game.UpdateHeader(message)
      expect(game.header).toBe(message)
    })
  })
  describe('setGameOver', () => {
    game = new GameSession()

    it('Sets appropiate message and state if win', () => {
      game.setGameOver('Win')
      expect(game.header).toBe(
        'YOU WON CONGRATS!!!...new game starting shortly'
      )
      expect(game.status).toBe('Win')
    })
    it('Sets appropiate message and state if lose', () => {
      game.setGameOver('Lose')
      expect(game.header).toBe('Sorry you lost...new game starting shortly')
      expect(game.status).toBe('Lose')
    })
  })
  describe('RestartGame', () => {
    game = new GameSession()

    it('Resets guessed letters list', () => {
      game.UpdateWord('A')
      game.RestartGame()
      expect(game.guessedLetters.length).toBe(0)
    })
    it('empty out word', () => {
      game.word = 'Hello'
      game.fullWord = 'Hello'
      game.RestartGame()
      expect(game.word).toBe('')
      expect(game.fullWord).toBe('')
    })
    it('Removes active player', () => {
      game.ActivePlayer = 'Gabe'
      game.RestartGame()
      expect(game.ActivePlayer).toBe(0)
    })
    it("Has header display 'Waiting for Players'", () => {
      game.header = 'Hello'
      game.RestartGame()
      expect(game.header).toBe('Waiting for Players')
    })
    it('Resets guesses', () => {
      game.hang = 3
      game.RestartGame()
      expect(game.hang).toBe(0)
    })
    it('Resets the hangman Image', () => {
      game.hangImage = 'hang3.png'
      game.RestartGame()
      expect(game.hangImage).toBe('hang0.png')
    })
    it("Sets status to 'Wait'", () => {
      game.status = 'In Progress'
      game.RestartGame()
      expect(game.status).toBe('Wait')
    })
    describe('checkIfWin', () => {
      game = new GameSession()

      it("Sets state to 'Win' if all letters are revealed in game.word", () => {
        game.status = 'Wait'
        game.word = 'TEST'
        game.checkIfWin()
        expect(game.status).toBe('Win')
      })
      it("does not change state to 'Win' if not all letters are revealed in game.word", () => {
        game.status = 'Wait'
        game.word = 'T_S_'
        game.checkIfWin()
        expect(game.status).not.toBe('Win')
      })
    })
    describe('RemovePlayer', () => {
      game = new GameSession()

      it('removes player based off of id from game.listofPlayers', () => {
        game.addPlayer('Gabe', '123')
        game.RemovePlayer('123')
        expect(game.listOfPlayers.peek()).not.toBe('Gabe')
      })
      it('removes player based off of id from game.IdtoName', () => {
        game.addPlayer('Gabe', '123')
        game.RemovePlayer('123')
        expect(Object.keys(game.idToName).length).toBe(0)
      })
      it('Sets a new Active player if the current active player is the one removed', () => {
        game.addPlayer('Gabe', '123')
        game.addPlayer('Henry', '456')
        game.SwitchPlayer()
        game.RemovePlayer('123')
        expect(game.ActivePlayer).toBe('Henry')
      })
    })
    describe('UpdateHeader', () => {
      game = new GameSession()

      it('Changes current header to the new given one', () => {
        let message = 'Test Message'
        game.UpdateHeader(message)
        expect(game.header).toBe(message)
      })
    })
    describe('CheckNameUnique', () => {
      game = new GameSession()

      it('returns 0 if the name is unique', () => {
        game.addPlayer('Gabe', '123')
        expect(game.CheckNameUnique()).toBe(0)
      })
      it('returns number of occurences of the name if not unique', () => {
        game.addPlayer('Gabe', '123')
        game.addPlayer('Gabe(1)', '456') //Repeats will look like this
        expect(game.CheckNameUnique('Gabe')).toBe(2)
      })
    })
    /*
    this.guessedLetters = [];
    this.word = '';
    this.fullWord = '';
    this.ActivePlayer = 0;
    this.hang = 0;
    this.header = "Waiting for Players"
    this.hangImage = "hang0.png";
    this.status = this.States.WAIT;
    this.SetTimer(this.WaitingTimer);
    */
  })

  /*
  test('addPlayer', () => {
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
  */
})
