const Queue = require('../component/Queue')

describe('GameSession', () => {
  let Q

  beforeEach(() => {
    Q = new Queue()
  })
  describe('enqueue', () => {
    Q = new Queue()

    it('adds item to Queue', () => {
      Q.enqueue('Test')
      expect(Q.items[0]).toBe('Test')
    })
  })
  describe('dequeue', () => {
    Q = new Queue()

    it('Removes front most item', () => {
      Q.enqueue('Test')
      Q.enqueue('Test2')
      Q.dequeue()
      expect(Q.items[0]).toBe('Test2')
    })
    it('Returns front most item', () => {
      Q.enqueue('Test')
      Q.enqueue('Test2')

      expect(Q.dequeue()).toBe('Test')
    })
  })
  describe('peek', () => {
    Q = new Queue()

    it('returns first item without removing it', () => {
      Q.enqueue('Test')
      Q.enqueue('Test2')
      expect(Q.peek()).toBe('Test')
      expect(Q.items[0]).toBe('Test')
    })
  })
  describe('size', () => {
    Q = new Queue()

    it('returns size of the queue', () => {
      expect(Q.size()).toBe(0)
      Q.enqueue('Test')
      expect(Q.size()).toBe(1)
      Q.enqueue('Test2')
      expect(Q.size()).toBe(2)
      Q.dequeue()
      expect(Q.size()).toBe(1)
    })
  })
  describe('isEmpty', () => {
    Q = new Queue()

    it('returns true if queue is empty', () => {
      expect(Q.isEmpty()).toBe(true)
    })
    it('returns false if queue is not empty', () => {
      Q.enqueue('Test')
      expect(Q.isEmpty()).toBe(false)
    })
  })
  describe('forceOut', () => {
    Q = new Queue()

    it('Removes the given item no matter where it is', () => {
      Q.enqueue('Test1')
      Q.enqueue('Test2')
      Q.enqueue('Test3')
      console.log(Q.items)
      Q.forceOut('Test2')
      console.log(Q.items)
      Q.dequeue()
      console.log(Q.items)
      expect(Q.peek()).toBe('Test3')
    })
  })
  describe('CountOccurrence', () => {
    Q = new Queue()

    it('Counts # of occurence of a particular item in the queue', () => {
      Q.enqueue('Test')
      Q.enqueue('Test')
      Q.enqueue('Test2')

      expect(Q.CountOccurrence('Test')).toBe(2)
    })
    it('Counts # of occurence of a particular item in the queue even if it has something in paranthesis in the end', () => {
      Q.enqueue('Test')
      Q.enqueue('Test(1)')
      Q.enqueue('Test2')
      Q.enqueue('Test2(1)')

      expect(Q.CountOccurrence('Test')).toBe(2)
    })
    it('returns 0 if no occurrences', () => {
      Q.enqueue('Test')
      Q.enqueue('Test(1)')
      Q.enqueue('Test2')
      Q.enqueue('Test2(1)')

      expect(Q.CountOccurrence('Test3')).toBe(0)
    })
  })
})
