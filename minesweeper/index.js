/* variables */
let table = [
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
]
let queue = new Set()
let timer = 0
let bombs = 10
let gameIsEnd = true
let isMouseDown = false
let score = localStorage.score1337mine
  ? JSON.parse(localStorage.score1337mine)
  : []

/* sounds */
const clickSnd = new Audio('assets/sounds/click.wav')
clickSnd.volume = 0.1
const flagSnd = new Audio('assets/sounds/flag.wav')
flagSnd.volume = 0.1
const unFlagSnd = new Audio('assets/sounds/unflag.wav')
unFlagSnd.volume = 0.1
const winSnd = new Audio('assets/sounds/gameWin.wav')
winSnd.volume = 0.1
const looseSnd = new Audio('assets/sounds/GameOver.wav')
looseSnd.volume = 0.1

/* UI */

const smiles = ['&#128522;', '&#128558;', '&#128565;', '&#128526;']
const board = document.querySelector('.board')
const button = document.querySelector('.main-btn')
const timerView = document.querySelector('.timer')
const bombsView = document.querySelector('.mines-counter')
const game = document.querySelector('.game__main')

/* classes */

class Mouse {
  constructor() {
    this._x = null
    this._y = null
    this._isUp = null
    this._isDown = null
  }

  get position() {
    return { x: this._x, y: this._y }
  }

  get x() {
    return this._x
  }

  set x(x) {
    this._x = x
  }

  get y() {
    return this._y
  }

  set y(y) {
    this._y = y
  }

  get isDown() {
    return this._isDown
  }

  set isDown(value) {
    this._isDown = value
  }
}

const mouse = new Mouse()

/* functions */

function initGame() {
  table = [
    ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ]
  timer = 0
  bombs = 10
  setSmile(0)
  renderTimer()
  renderBombs()
  clearBoard()
  setBomb()
}

function setBomb() {
  const count = 10
  const bombsPositions = new Set()
  while (bombsPositions.size < count) {
    const x = Math.floor(0 + Math.random() * (8 + 1 - 0)).toString()
    const y = Math.floor(0 + Math.random() * (8 + 1 - 0)).toString()
    bombsPositions.add(x + y)
  }
  bombsPositions.forEach((bomb) => {
    table[bomb[0]][bomb[1]] = '*'
  })
  setTable()
}

function setTable() {
  table.forEach((row, y) => {
    row.forEach((cell, x) => {
      table[y][x] = setAround(x, y)
    })
  })
}

function setAround(x, y) {
  let count = 0

  if (table[y][x] === '*') return '*'
  if (table[y - 1]) {
    if (table[y - 1][x - 1] === '*') count++
    if (table[y - 1][x] === '*') count++
    if (table[y - 1][x + 1] === '*') count++
  }

  if (table[y][x - 1] === '*') count++
  if (table[y][x + 1] === '*') count++

  if (table[y + 1]) {
    if (table[y + 1][x - 1] === '*') count++
    if (table[y + 1][x] === '*') count++
    if (table[y + 1][x + 1] === '*') count++
  }
  return count.toString()
}

function startGame() {
  gameIsEnd = false
  setTimer()
}

function setTimer() {
  setTimeout(() => {
    if (!gameIsEnd) {
      timer++
      renderTimer()
      setTimer()
    }
  }, 1000)
}

function setSmile(smile) {
  button.innerHTML = smiles[smile]
}

function renderTimer() {
  timerView.textContent = timer.toString().padStart(3, 0)
}

function renderBombs() {
  bombsView.textContent = bombs.toString().padStart(3, 0)
}

function renderResult(result) {
  board.classList.add('hidden')

  result === 'Win' ? winSnd.play() : looseSnd.play()

  const gameResult = [result, timer]
  score.unshift(gameResult)
  score.length = score.length > 10 ? 10 : score.length
  localStorage.setItem('score1337mine', JSON.stringify(score))

  const resultBlock = `
  <div class="result">
    <div class="result__title">${result}
  </div>
    <div class="result__turns">${timer} seconds</div>
    <div class="result__table">
      <table class="table">
        <thead>
          <tr>
            <th>Result</th>
            <th>Time</th>
          </tr>
        </thead>  
        <tbody>
          ${renderScore()}
        </tbody>
      </table>
    </div>
  </div>
  `
  game.insertAdjacentHTML('afterbegin', resultBlock)
}

function renderScore() {
  let rows = ''
  for (let i = 0; i < score.length; i++) {
    rows += `<tr>
              <td>${score[i][0]}</td>
              <td>${score[i][1]}</td>
            </tr>`
  }
  return rows
}

function clearBoard() {
  const result = document.querySelector('.result')
  if (result) {
    result.remove()
    board.classList.remove('hidden')
  }
  for (const cell of board.children) {
    if (cell.classList.contains('cell')) {
      cell.innerHTML = ''
      cell.classList.remove(...cell.classList)
      cell.classList.add('cell')
      cell.classList.add('closed')
    }
  }
}

function openCell(x, y) {
  const cell = document.querySelector(`[data-position='${y}${x}']`)

  x = parseInt(x)
  y = parseInt(y)

  if (cell.classList.contains('opened')) {
    return null
  }

  clickSnd.play()

  if (table[y][x] === '0') {
    cell.classList.remove('closed')
    cell.classList.add('opened')
    cell.textContent = ''

    getAround(x, y).forEach((cell) => {
      openCell(cell.x, cell.y)
    })
  }

  if (table[y][x] === '*') {
    cell.classList.remove('closed')
    cell.classList.add('opened')
    cell.classList.add('bomb')
    cell.textContent = table[y][x]

    gameIsEnd = true
    setSmile(2)
    renderResult('Loose')
  } else if (+table[y][x] > 0) {
    cell.classList.remove('closed')
    cell.classList.add('opened')
    cell.textContent = table[y][x]
  }

  if (bombs === 0 && allOpened()) {
    gameIsEnd = true
    setSmile(3)
    renderResult('Win')
  }
}

function allOpened() {
  let count = 0
  for (let cell of board.children) {
    count += cell.classList.contains('opened') ? 1 : -1
  }
  return count === 81 ? true : false
}

function getAround(x, y) {
  const out = []

  if (table[y - 1] !== undefined) {
    if (table[y - 1][x - 1] !== undefined)
      out.push({
        x: x - 1,
        y: y - 1,
      })
    if (table[y - 1][x] !== undefined)
      out.push({
        x: x,
        y: y - 1,
      })
    if (table[y - 1][x + 1] !== undefined)
      out.push({
        x: x + 1,
        y: y - 1,
      })
  }

  if (table[y][x - 1] !== undefined)
    out.push({
      x: x - 1,
      y: y,
    })
  if (table[y][x + 1] !== undefined)
    out.push({
      x: x + 1,
      y: y,
    })

  if (table[y + 1] !== undefined) {
    if (table[y + 1][x - 1] !== undefined)
      out.push({
        x: x - 1,
        y: y + 1,
      })
    if (table[y + 1][x] !== undefined)
      out.push({
        x: x,
        y: y + 1,
      })
    if (table[y + 1][x + 1] !== undefined)
      out.push({
        x: x + 1,
        y: y + 1,
      })
  }

  // console.log(out)

  return out
}

/* listeners */

button.addEventListener('click', () => {
  gameIsEnd = true
  initGame()
})

board.addEventListener('contextmenu', (e) => {
  e.preventDefault()

  if (e.target.classList.contains('closed')) {
    e.target.classList.toggle('flag')
    e.target.classList.toggle('opened')
    if (e.target.classList.contains('flag')) {
      flagSnd.play()
      bombs--
      renderBombs()
    } else {
      unFlagSnd.play()
      bombs++
      renderBombs()
    }
  }
  if (bombs === 0 && allOpened()) {
    console.log('win')
    initGame()
  }
})

board.addEventListener('mouseover', (e) => {
  if (e.target.classList.contains('cell')) {
    mouse.y = e.target.dataset.position[0]
    mouse.x = e.target.dataset.position[1]
    // console.log(mouse.position)
  } else {
    mouse.y = null
    mouse.x = null
  }
})

board.addEventListener('click', (e) => {
  if (gameIsEnd) {
    startGame()
  }
  openCell(mouse.x, mouse.y)
})

/* init */

initGame()
