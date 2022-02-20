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

/* UI */

const smiles = ['&#128522;', '&#128558;', '&#128565;']
const board = document.querySelector('.board')
const button = document.querySelector('.main-btn')
const timerView = document.querySelector('.timer')

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
  clearBoard()
  setBomb()
}

function setBomb() {
  const count = 10
  const bombsPositions = new Set()
  while (bombsPositions.size < count) {
    const x = Math.floor(0 + Math.random() * (8 + 1 - 0))
    const y = Math.floor(0 + Math.random() * (8 + 1 - 0))
    bombsPositions.add({ x: x, y: y })
  }
  bombsPositions.forEach((bomb) => {
    table[bomb.x][bomb.y] = '*'
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

function clearBoard() {
  for (const cell of board.children) {
    cell.innerHTML = ''
    cell.classList.remove(...cell.classList)
    cell.classList.add('cell')
    cell.classList.add('closed')
  }
}

function openCell(x, y) {
  const cell = document.querySelector(`[data-position='${y}${x}']`)

  x = parseInt(x)
  y = parseInt(y)

  if (cell.classList.contains('opened')) {
    return null
  }

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
  } else if (+table[y][x] > 0) {
    cell.classList.remove('closed')
    cell.classList.add('opened')
    cell.textContent = table[y][x]
    // if all opened - win()
  }
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

board.addEventListener('click', () => {
  if (gameIsEnd) {
    startGame()
  }
  openCell(mouse.x, mouse.y)
})

// board.addEventListener('mousedown', (e) => {
//   if (e.button === 0) {
//     e.preventDefault()
//     isMouseDown = true
//     if (
//       !e.target.classList.contains('flag') &&
//       !e.target.classList.contains('opened')
//     ) {
//       setSmile(1)
//       e.target.classList.remove('closed')
//       e.target.classList.add('opened')
//     }
//   }
// })

// board.addEventListener('mouseup', (e) => {
//   if (e.button === 0) {
//     isMouseDown = false
//     setSmile(0)
//   }

//   if (e.button === 2) {
//     if (e.target.classList.contains('closed')) {
//       e.target.classList.toggle('flag')
//     }
//   }
// })

// board.addEventListener('mouseover', (e) => {
//   if (isMouseDown) {
//     if (!e.target.classList.contains('flag')) {
//       e.target.classList.remove('closed')
//     } else {
//       setSmile(0)
//     }
//   }
//   if (!e.target.classList.contains('cell')) {
//     isMouseDown = false
//     setSmile(0)
//   }
// })

// board.addEventListener('mouseout', (e) => {
//   if (isMouseDown && e.target.classList.contains('cell')) {
//     if (
//       !e.target.classList.contains('flag') &&
//       !e.target.classList.contains('opened')
//     ) {
//       setSmile(1)
//       e.target.classList.add('closed')
//     }
//   }
// })

// document.body.addEventListener('mouseover', (e) => {
//   if (!e.target.classList.contains('cell')) {
//     isMouseDown = false
//     setSmile(0)
//   }
// })

/* init */

initGame()
