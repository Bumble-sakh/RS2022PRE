/* variables */

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
    this._position = null
    this._isUp = null
    this._isDown = null
  }

  get position() {
    return this._position
  }

  set position(position) {
    this._position = position
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
  timer = 0
  bombs = 10
  setSmile(0)
  renderTimer()
  clearBoard()
  // setBomb()
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
    mouse.position = e.target.dataset.position
    console.log(mouse.position)
  } else {
    mouse.position = null
  }
})

// board.addEventListener('click', () => {
//   if (gameIsEnd) {
//     startGame()
//   }
// })

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
